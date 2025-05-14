---
layout: post
title: "Securing SSH: A Deep Dive into Fail2Ban Configuration and Rule Management"
author: "Aug"
date: 2024-06-03
header-style: text
catalog: true
description: "A detailed guide to troubleshooting and configuring Fail2Ban with UFW for robust SSH security. Covers iptables rule order, jail.local setup, persistent bans, and ensuring proper cleanup of rules on service restart."
tags:
  - security
  - fail2ban
  - ufw
  - ssh
  - iptables
  - linux-security
  - server-security
  - firewall
  - intrusion-detection
  - log-monitoring
  - ssh-hardening
---

## Understanding the Issue

Despite having Fail2Ban and UFW installed, unauthorized login attempts were not blocked. I didnt understand the order of rule processing in iptables. I modified the rules to preserve bans on restart which started my issues (you shouldn't have these issues if you just keep the out of the box sshd rules).

The fail2ban jail is implemented as iptables rules, if there are no relevant rules or rules with all 0.0.0.0, then no blocks are happening!!!!
If there are any startup errors for any jails, none of the jails will work (if xrdp jail fails, then ssh won't work either)
Both ufw and fail2ban are wrappers around the underlying iptables packet filtering.
If you continue to see unknown login attempts in /var/log/auth.log, then the JAIL ISNT WORKING.

BTW for persistent bans, recommend you just use this package instead of implementing your own with custom actions:

```bash
sudo apt-get install iptables-persistent
sudo netfilter-persistent save
```

## Solutions Implemented

### 1. Make sure the jail.local is configured properly

To ensure that Fail2Ban functions effectively, the `jail.local` file must be correctly set up. This configuration file overrides the default settings in `jail.conf` and tailors the fail2ban service to your specific needs.

#### Key Configurations:

- **Jail Definition:** Define the [sshd] section if not already present, specifying the backend to use, the log path, and the specific filter and make sure its enabled.

```bash
[sshd]
enabled = true
port = 1000
filter = sshd
logpath = /var/log/auth.log
backend = %(sshd_backend)s
bantime = -1 # indefinite ban
findtime = 3600  # Time frame for counting retries
maxretry = 1  # Number of retries before a ban
```

### 2. Check if any IPTABLES Rules are there

fail2ban implements blocking rules using iptables. Check if there are any rules using this command:

```bash
sudo iptables -L -n
```

Your rule chain (e.g., f2b-sshd) should appear before all other rules that allow traffic, such as ufw:

```bash
Chain INPUT (policy DROP)
target     prot opt source               destination
f2b-sshd   all  --  0.0.0.0/0            0.0.0.0/0
ufw-before-logging-input  all  --  0.0.0.0/0            0.0.0.0/0
ufw-before-input  all  --  0.0.0.0/0            0.0.0.0/0
ufw-after-input  all  --  0.0.0.0/0            0.0.0.0/0
ufw-after-logging-input  all  --  0.0.0.0/0            0.0.0.0/0
ufw-reject-input  all  --  0.0.0.0/0            0.0.0.0/0
ufw-track-input  all  --  0.0.0.0/0            0.0.0.0/0
```

There should be only 1 f2b-sshd chain (as above) and there should be DROP rules for the banned IPs:

```bash
Chain f2b-sshd (1 references)
target     prot opt source               destination
DROP       all  --  93.120.240.202       0.0.0.0/0
DROP       all  --  43.163.199.47        0.0.0.0/0
DROP       all  --  119.28.115.120       0.0.0.0/0
DROP       all  --  64.227.185.239       0.0.0.0/0
```

I had multiple f2b-sshd chains that weren't being cleaned up properly on fail2ban restart. I had to manually clean up the spurious rules and the f2b-sshd chains before I could get everything working.

### 3. Proper Ordering of the f2b-sshd Chain

The f2b-sshd chain needs to be evaluated before any UFW rule chains to ensure that banned IPs are blocked immediately.
The action to add the chain should be Insert (I) not Append (A) and it should be inserted at the top. The 'INPUT 1' flag does this:

**Command in iptables-multiport.conf to insert the f2b-sshd chain at the top of the INPUT chain and restore bans from file when fail2ban starts:**

```bash
actionstart =
    <iptables> -N f2b-<name>  # Create a new chain named f2b-<name> in iptables
    <iptables> -I INPUT 1 -j f2b-<name>  # Insert the f2b-<name> chain at the top of the INPUT chain to ensure it's evaluated first
    <iptables> -I f2b-<name> 1 -j <returntype>  # Insert a rule at the top of the f2b-<name> chain to specify the action (e.g., RETURN)
    cat /etc/fail2ban/persistent.bans | awk '/^fail2ban-<name>/ {print $2}' \  # Read the persistent bans file, extract IPs for the f2b-<name> chain
    | while read IP; do iptables -I f2b-<name> 1 -s $IP -j <blocktype>; done  # For each IP, insert a rule at the top of the f2b-<name> chain to block the IP

```

The definitions for the commands in the <> tags are defined in other files like iptables-common.conf.

### 4. Example actionban

**Command to ban an ip and add to persistent bans file:**
This will add a rule to the f2b-sshd chain, which is referenced in the default iptables INPUT chain.

```bash
actionban =
    <iptables> -I f2b-<name> 1 -s <ip> -j <blocktype>  # Insert a rule at the top of the f2b-<name> chain to block the IP specified
    echo "fail2ban-<name> <ip>" >> /etc/fail2ban/persistent.bans  # Append the ban information to the persistent bans file for record-keeping
```

### 5. Cleaning Up Old Rules on Fail2Ban Restart

Making sure all Fail2Ban rules are properly removed on restart is crucial to avoid conflicts with stale rules. All rules need to be deleted, then rules flushed, then the rule chain itself can be deleted. If any rules are still present, deleting the chain will fail! The -D command needs to find the rules that were previously added with -A. If the rules look different then they won't be deleted!

**Commands used in `actionstop` to flush old rules:**
Notice this -D command matches the above -I command (except for the syntax to insert rule at the first line of the chain which isn't relevant.)

```bash
actionstop =
    <iptables> -D <chain> -j f2b-<name>  # Delete the rule that jumps to the f2b-<name> chain from the specified <chain>
    <actionflush>  # Execute the command to flush all rules in the f2b-<name> chain (specific command should be defined elsewhere)
    <iptables> -X f2b-<name>  # Delete the f2b-<name> chain from iptables
```

You can also manually run rules for troubleshooting. You will need to run the -D command multiple times to delete all rules in a rule chain manually.

```bash
iptables -D <chain> -p <protocol> -j f2b-<name>  # Delete a specific rule in the <chain> that directs traffic to the f2b-<name> chain for a given <protocol>
iptables -F f2b-<name>  # Flush all rules in the f2b-<name> chain, effectively removing all specific blocking rules within that chain
iptables -X f2b-<name>  # Delete the f2b-<name> chain itself after flushing its rules
```

All rules must be deleted before a chain can be deleted (-X). If you see a rule chain can't be deleted, then it's probably because a rule in that chain is still there. This is probably because the -D command can't find a rule to delete (because a rule was added with different syntax), or there are still rules left to delete.

### 6. Adjusting Rule Deletion for Non-default Actions

Matching the rule deletion commands to the specific rules added by Fail2Ban, especially when using non-default ports or additional/different flags.

**Command to delete the f2b-sshd chain from the default INPUT chain:**
I needed to run this command multiple times because the same f2b-sshd custom chain was defined several times in my INPUT chain due to previous issues.

```bash
sudo iptables -D INPUT -p tcp -j f2b-sshd
```

**Command to list and delete other rules from INPUT chain:**

```bash
sudo iptables -L INPUT --line-numbers
sudo iptables -D INPUT <line-number-of-rule>
```

You can use the same --line-numbers method to directly delete individual rules from any chain.

## Conclusion

Make sure to check the /var/log/fail2ban.log for any errors on startup or shutdown in adding ban rules, or removing rules on cleanup. If there are any errors then the bans are likely not happening properly. If you see lots of login activity in your /var/log/auth.log then the bans aren't working!

---
