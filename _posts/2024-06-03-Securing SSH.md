---
layout: post
title: "Securing SSH: A Detailed Look at Fail2Ban Configuration and Rule Management"
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

Even though I had Fail2Ban and UFW installed, they were not blocking unauthorized login attempts. I did not understand how `iptables` processes rules in order. I changed the rules to keep bans after a restart, and this caused my problems. (You should not have these problems if you use the standard `sshd` rules provided by Fail2Ban).

Fail2Ban's "jail" (its blocking mechanism) works by adding rules to `iptables`. If there are no relevant rules, or if rules exist but specify `0.0.0.0` (meaning any IP), then no IPs are actually being blocked.
If any jail has startup errors, then none of the jails will work. For example, if the `xrdp` jail fails, the `ssh` jail won't work either.
Both UFW and Fail2Ban are tools that manage the underlying `iptables` packet filtering system.
If you keep seeing unknown login attempts in `/var/log/auth.log`, the Fail2Ban jail is not working.

By the way, for bans that stay after a restart (persistent bans), I recommend using this package instead of creating your own custom setup:

```bash
sudo apt-get install iptables-persistent
sudo netfilter-persistent save
```

## Solutions Implemented

### 1. Make sure the jail.local is configured properly

To make sure Fail2Ban works well, you need to set up the `jail.local` file correctly. This file changes the default settings from `jail.conf` and adjusts Fail2Ban for what you need.

#### Key Configurations:

- **Jail Definition:** If it's not already there, define the `[sshd]` section. Specify the backend to use, the log path, the specific filter, and make sure it's enabled.

```ini
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

Fail2Ban implements blocking rules using `iptables`. Check if there are any rules using this command:

```bash
sudo iptables -L -n
```

Your Fail2Ban rule chain (like `f2b-sshd`) should be listed before any other rules that allow traffic (like UFW rules):

```text
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

There should be only one `f2b-sshd` chain (as above), and it should contain `DROP` rules for the banned IPs:

```text
Chain f2b-sshd (1 references)
target     prot opt source               destination
DROP       all  --  93.120.240.202       0.0.0.0/0
DROP       all  --  43.163.199.47        0.0.0.0/0
DROP       all  --  119.28.115.120       0.0.0.0/0
DROP       all  --  64.227.185.239       0.0.0.0/0
```

I had several `f2b-sshd` chains that were not removed correctly when Fail2Ban restarted. I had to manually remove these extra rules and `f2b-sshd` chains before I could resolve the issues.

### 3. Proper Ordering of the f2b-sshd Chain

The `f2b-sshd` chain must be checked before any UFW rule chains. This ensures that banned IPs are blocked right away.
The action to add the chain should be `Insert` (I), not `Append` (A), so it's placed at the top of the INPUT chain. The `INPUT 1` part of the command achieves this:

**Command in `iptables-multiport.conf` to insert the `f2b-<name>` chain at the top of the INPUT chain and restore bans from a file when Fail2Ban starts:**

```conf
actionstart =
    <iptables> -N f2b-<name>  # Create a new chain named f2b-<name>
    <iptables> -I INPUT 1 -j f2b-<name>  # Insert f2b-<name> at the top of INPUT chain
    <iptables> -I f2b-<name> 1 -j <returntype>  # Insert a rule at the top of f2b-<name> (e.g., RETURN)
    cat /etc/fail2ban/persistent.bans | awk '/^fail2ban-<name>/ {print $2}' \  # Read persistent bans, get IPs for this chain
    | while read IP; do iptables -I f2b-<name> 1 -s $IP -j <blocktype>; done  # For each IP, insert a block rule at the top of f2b-<name>
```

(The definitions for commands like `<iptables>`, `<returntype>`, and `<blocktype>` are in other configuration files, such as `iptables-common.conf`.)

### 4. Example actionban

**Command to ban an IP and add it to a persistent bans file:**
This adds a rule to the `f2b-<name>` chain.

```conf
actionban =
    <iptables> -I f2b-<name> 1 -s <ip> -j <blocktype>  # Insert a rule at the top of f2b-<name> to block the IP
    echo "fail2ban-<name> <ip>" >> /etc/fail2ban/persistent.bans  # Add ban to persistent file
```

### 5. Cleaning Up Old Rules on Fail2Ban Restart

It's very important to make sure all Fail2Ban rules are removed correctly when it restarts. This prevents conflicts with old, outdated rules. All individual rules in a chain must be deleted, then the chain must be flushed (emptied), and only then can the rule chain itself be deleted. If any rules are still in the chain, you won't be able to delete the chain.

The delete command (`-D`) needs to match rules that were previously added (e.g., with `-I`). If the rule definition looks different, the delete command won't find and remove it.

**Commands used in `actionstop` to flush old rules:**
Notice this `-D` command matches the `-I` command from `actionstart` used to jump to the `f2b-<name>` chain (the line number `1` isn't needed for deletion here as it matches the jump rule itself).

```conf
actionstop =
    <iptables> -D <chain> -j f2b-<name>  # Delete the rule that jumps to f2b-<name> from the main <chain>
    <actionflush>  # Flush all rules in the f2b-<name> chain
    <iptables> -X f2b-<name>  # Delete the f2b-<name> chain itself
```

You can also manually run these types of commands for troubleshooting. You might need to run a delete command multiple times if a rule appears more than once, or to delete all individual rules in a chain manually before flushing and deleting the chain.

```bash
iptables -D <chain> -p <protocol> -j f2b-<name>  # Example: Delete a specific jump rule from <chain>
iptables -F f2b-<name>  # Flush all rules within the f2b-<name> chain
iptables -X f2b-<name>  # Delete the f2b-<name> chain (only if empty)
```

All rules must be removed before a chain can be deleted (using `-X`). If you find that a rule chain cannot be deleted, it is likely because there are still rules within that chain. This might be because the delete command (`-D`) cannot find a matching rule to delete (perhaps because the rule was added with different details), or there are simply more rules remaining in the chain that need to be deleted one by one.

### 6. Adjusting Rule Deletion for Non-default Actions

Make sure your rule deletion commands exactly match the rules added by Fail2Ban, especially if you're using non-standard ports or have added extra flags to your rules.

**Command to delete the `f2b-sshd` jump rule from the default `INPUT` chain:**
I had to run this command several times because, due to earlier problems, the same `f2b-sshd` custom chain was incorrectly linked multiple times in my `INPUT` chain.

```bash
sudo iptables -D INPUT -p tcp -j f2b-sshd
```

**Command to list and delete other rules from `INPUT` chain by line number:**

```bash
sudo iptables -L INPUT --line-numbers
sudo iptables -D INPUT <line-number-of-rule>
```

You can use the same `--line-numbers` method to directly delete individual rules from any chain.

## Conclusion

Check the `/var/log/fail2ban.log` file for any errors when Fail2Ban starts or stops, especially errors related to adding ban rules or removing rules during cleanup. If there are errors, the bans are probably not working correctly. If you see lots of login activity in your `/var/log/auth.log`, then the bans aren't working.

---
