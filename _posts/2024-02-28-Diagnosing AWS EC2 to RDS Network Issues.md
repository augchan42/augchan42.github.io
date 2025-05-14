---
layout: post
title: "Cracking AWS Network Issues: EC2 Docker to RDS Postgres Connectivity"
author: "Aug"
date: 2024-02-28
header-style: text
catalog: true
description: "A step-by-step guide to diagnosing and fixing network connection problems between a Dockerized Spring Boot app on AWS EC2 and an RDS Postgres database. Learn to use nslookup, nc, psql for troubleshooting, and how to configure Docker DNS for private AWS VPC name resolution."
tags:
  - aws
  - ec2
  - rds
  - postgres
  - networking
  - docker
  - spring-boot
  - dns
  - aws-vpc
  - security-groups
  - troubleshooting
---

I recently helped a project implement user logins and data persistence using Spring Boot, with the application deployed in a Docker container on AWS EC2 and the database running as an AWS RDS Postgres instance. One of the most common (and frustrating!) hurdles we faced was getting the EC2 instance and the RDS database to communicate correctly within our Virtual Private Cloud (VPC).

Here's a breakdown of the problem, the tools I used to diagnose it, and the eventual solution.

**The Scenario: Public vs. Private IP Resolution**

My setup was:

- A Spring Boot application running inside a Docker container on an EC2 instance.
- A Postgres database deployed as an AWS RDS instance.
- Both EC2 and RDS were located in the same AWS Availability Zone and VPC.

The core issue stemmed from how the RDS database endpoint (its address, like `dbhost.ap-southeast-1.rds.amazonaws.com`) was being resolved to an IP address.
The Docker container running the Spring server had been started with a public DNS server (like Cloudflare's 1.1.1.1) configured for it. This meant that when the Spring application tried to connect to the RDS endpoint, the endpoint's domain name was resolving to its **public IP address** (e.g., something like `3.1.x.x`) _inside_ the Docker container.

This was a problem because, for security best practices, I had configured the RDS instance to **not allow connections from public IPs**. It should only be accessible via its private IP within the VPC.

**My Diagnostic Toolkit**

To figure out what was going on, I used a few standard command-line tools. It's crucial to run these tools both on the EC2 host machine itself _and_ from inside the Docker container to compare the results.

1.  **`nslookup`**: Checks what IP address a given hostname (domain name) resolves to.

    ```bash
    nslookup your-rds-endpoint.your-region.rds.amazonaws.com
    ```

    _What to look for:_ Does it resolve to the RDS instance's public IP or its private IP (usually something like `10.x.x.x` or `172.16.x.x-172.31.x.x` or `192.168.x.x`)?

2.  **`nc` (netcat)**: Tests basic network connectivity to a specific host and port.

    ```bash
    nc -zv your-rds-endpoint.your-region.rds.amazonaws.com 5432
    ```

    (`5432` is the default Postgres port).
    _What to look for:_ Does it say "Connection to ... succeeded!" or does it hang/fail?

3.  **`psql`**: The Postgres command-line client, to attempt a full database connection.
    ```bash
    psql --host=your-rds-endpoint.your-region.rds.amazonaws.com --port=5432 --dbname=yourdbname --username=youruser
    ```
    _What to look for:_ Can it connect successfully, or do you get a timeout or authentication error (which might actually be a network error in disguise if it can't even reach the host)?

**Running Commands Inside Your Docker Container:**
To execute these commands from _within_ your running Docker container:

1.  Find your container's name or ID: `docker ps`
2.  Launch a shell inside the container (assuming my container is named `backend` and has `bash`):
    ```bash
    docker exec -it backend /bin/bash
    ```
    Once inside, you might need to install these tools if they aren't part of your base Docker image (e.g., `apt-get update && apt-get install dnsutils netcat-openbsd postgresql-client`).

**The Diagnosis and Resolution**

Here's what my troubleshooting revealed:

- **From the EC2 host machine:**
  - `nslookup` for the RDS FQDN correctly resolved to its **private IP** (e.g., `10.x.x.x`).
  - `nc` connectivity to the RDS instance on port 5432 initially _failed_.
- **From inside the Docker container:**
  - `nslookup` for the RDS FQDN resolved to its **public IP** (e.g., `3.1.x.x`). This was the main clue!
  - Naturally, `nc` also failed from within the container.

This pointed to two distinct problems that needed fixing:

**Fix 1: Allow RDS Traffic from the VPC's Private Network**
The `nc` test failing from the EC2 host (even when `nslookup` gave the private IP) indicated a firewall issue. The RDS instance's **Security Group** (which acts as a virtual firewall) needed an inbound rule to allow traffic from the EC2 instance's private IP range.

- **Action:** I added an inbound rule to the RDS Security Group to allow connections on the Postgres port (5432) from the private CIDR block of my VPC (e.g., `10.0.0.0/16`, or a more specific subnet like `10.0.1.0/24` if my EC2 instance was in that subnet).
- After this, the `nc` test from the EC2 host to the RDS private IP started working.

**Fix 2: Configure Docker to Use AWS Private DNS**
The Docker container resolving the RDS endpoint to a public IP was because it wasn't using the VPC's internal DNS resolver. AWS provides a DNS server at a special IP address within your VPC (usually the `.2` address of your VPC's primary CIDR block, e.g., `10.0.0.2` if your VPC is `10.0.0.0/16`). This internal DNS server knows how to resolve AWS service endpoints (like RDS endpoints) to their private IPs when queried from within the VPC.

- **Action:** I needed to tell Docker to use this AWS private DNS server for the container. I found the correct DNS IP for my VPC (ChatGPT actually helped me confirm this based on my AWS network configuration). Then, I added the `--dns` flag to my `docker run` command:

  ```bash
  docker run -d --restart unless-stopped \
    --dns "10.0.0.2" \
    -e "SPRING_PROFILES_ACTIVE=aws" \
    -e "OPENAPI_SERVER_URL=https://develop.example.com" \
    --name backend -p 8080:8080 \
    your-docker-image:tag || exit 4
  ```

  _(Replace `10.0.0.2` with your VPC's actual DNS server IP, and other placeholders accordingly)._

After making these two changes:

1.  The RDS Security Group allowed inbound traffic from the EC2 instance's private network.
2.  The Docker container used the AWS private DNS, so the RDS endpoint resolved to its private IP inside the container.

With both these in place, the Spring application in the Docker container could successfully connect to the RDS Postgres database!

**Key Takeaway**
When dealing with AWS services within a VPC, always be mindful of how DNS resolution works, especially inside Docker containers. Ensure your Security Groups are correctly configured for private network traffic, and point your containers to the VPC's internal DNS resolver for private IP resolution of AWS service endpoints.
