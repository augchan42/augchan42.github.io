---
layout: post
title: "Diagnosing AWS EC2 to RDS Network Issues"
author: "Aug"
date: 2024-02-28
header-style: text
catalog: true
description: "A practical guide to diagnosing and resolving network connectivity issues between an AWS EC2 instance (running a Dockerized Spring application) and an AWS RDS Postgres database. Covers using nslookup, nc, psql, and configuring Docker DNS for private network resolution."
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

I've learned a few things while helping out a project implement logins and persistence
on Spring, deployed on AWS EC2 + Postgres on AWS RDS.

**Network Connectivity BS**

The biggest pain for EC2 + RDS is having them communicate with each other properly.
I have a Spring server deployed inside a docker container on EC2, and a Postgres DB
deployed as RDS.

**Scenario**

EC2 and RDS are in the same Availability Zone.
Spring server in docker container was started with a public DNS 1.1.1.1,
which meant the RDS
endpoint (given as a fully qualified domain name) resolved to the public IP
inside the docker container (3.1.x.x). This needs to be fixed before connectivity can be established as I disallowed public IP for the DB.

These are the tools I used to diagnose connectivity:

**nslookup** - to show what ip the db hostname resolves to

`nslookup dbhost.ap-southeast-1.rds.amazonaws.com`

**nc** - to test connectivity to a specific port

`nc -zv dbhost.ap-southeast-1.rds.amazonaws.com 5432`

**psql** - to connect to the database with db client

`psql --host=dbhost.ap-southeast-1.rds.amazonaws.com --port=5432 --dbname=postgres --username=postgres`

You will need to run these tools and compare the outputs from the ec2 host and from the docker container running in the ec2 host.

To run commands inside the docker container, find the container name via docker ps, then launch shell (my container name is `backend`):

`docker exec -it backend /bin/bash`

**Resolution**

Testing connectivity from the host to Postgres RDS worked fine (using nc) but failed
when done inside the docker container.

On the docker host, nslookup to the db FQDN resolved to the private ip (10.x.x.x.).

In the docker container, the same nslookup resolved to the public ip (3.1.x.x).

Two things needed to be done to allow connections from the Spring server in the docker container in EC2 to the Postgres RDS instance:

- An inbound rule needed to be added to the RDS instance to allow traffic from
  10.0.0.0/24 using Postgres IPV4 (the private CIDR range shared EC2 and RDS). Without this the nc test from the host failed.

- The Spring server needs to use the private network DNS

For reference here's the command to use the AWS private DNS (10.0.0.2) so that the RDS FQDN endpoint
can resolve to the private IP properly. I used ChatGPT to help me figure out what the DNS should be given my AWS network config:

`docker run -d --restart unless-stopped --dns "10.0.0.2" -e "SPRING_PROFILES_ACTIVE=aws" -e "OPENAPI_SERVER_URL=https://develop.lyla.travelbox.tech" --name backend -p 8080:8080 docker.io/library/lyla-backend:0.0.1-SNAPSHOT || exit 4`
