---
layout:       post
title:        "Securing SSH: A Deep Dive into Fail2Ban Configuration and Rule Management"
author:       "Aug"
header-style: text
catalog:      true
tags:
    - Security
    - Fail2Ban
    - UFW
    - SSH
    - iptables
---

## Understanding the Issue
Despite having Fail2Ban and UFW installed, unauthorized login attempts were not being effectively blocked. The main issues were related to the order of rule processing in iptables and the management of rules.  I was using a nonstandard ssh port (1000 instead of 22).  And I also modified the rules to preserve bans on restart which caused the issue.


The jail is implemented as iptables rules, if there are no relevant rules or rules with all 0.0.0.0, then no blocks are happening!!!!
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

- **Jail Definition:** Define the [sshd] section if not already present, specifying the backend to use, the log path, and the specific filter.

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
fail2ban implements blocking rules using iptables.  Check if there are any rules using this command:
```bash
sudo iptables -L -n
```
Your chain (e.g., f2b-sshd) should appear before all other rules that allow traffic, such as ufw:

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

### 3. Proper Ordering of the f2b-sshd Chain
The f2b-sshd chain needs to be evaluated before any UFW rules to ensure that banned IPs are blocked immediately.
The action to add the chain should be Insert (I) not Append (A) and it should be inserted at the top.  INPUT 1 does this:

**Command in iptables-multiport.conf to insert the f2b-sshd chain at the top of the INPUT chain and restore bans from file when fail2ban starts:**
```bash
actionstart = <iptables> -N f2b-<name>
              <iptables> -I INPUT 1 -j f2b-<name>
              <iptables> -I f2b-<name> 1 -j <returntype>
              cat /etc/fail2ban/persistent.bans | awk '/^fail2ban-<name>/ {print $2}' \
              | while read IP; do iptables -I f2b-<name> 1 -s $IP -j <blocktype>; done

```

### 4. Example actionban 
**Command to ban an ip and add to persistent bans file:**
This will add a rule to the f2b-sshd chain, which is referenced in the default iptables INPUT chain.

```bash
actionban = <iptables> -I f2b-<name> 1 -s <ip> -j <blocktype>
        echo "fail2ban-<name> <ip>" >> /etc/fail2ban/persistent.bans
```

### 5. Cleaning Up Old Rules on Fail2Ban Restart
Ensuring that all Fail2Ban rules are properly removed on restart was crucial to avoid conflicts with stale rules.  All rules need to be deleted, then rules flushed, then finally the chain itself can be deleted.  If any rules are still present, deleting the chain will fail!  The -D command needs to find the rules that were previously added with -A.  If the rules look different then they won't be deleted!

**Commands used in `actionstop` to flush old rules:**
Notice this -D command matches the above -I command (except for the syntax to insert rule at the first line of the chain which isn't relevant.)

```bash
actionstop = <iptables> -D <chain> -j f2b-<name>
             <actionflush>
             <iptables> -X f2b-<name>
```

You can also manually run the rules individually for troubleshooting:
```bash
iptables -D <chain> -p <protocol> -j f2b-<name>
iptables -F f2b-<name>
iptables -X f2b-<name>
```
BTW, all rules must be deleted before a chain can be deleted (-X).  If you see a rule chain can't be deleted, then it's probably because a rule in that chain is still there.  This is probably because the -D command can't find a rule to delete (because a rule was added with different syntax).

### 6. Adjusting Rule Deletion for Non-default Actions
Matching the rule deletion commands to the specific rules added by Fail2Ban, especially when using non-default ports.

**Correct command to delete a specific rule:**
```bash
sudo iptables -D INPUT -p tcp -j f2b-sshd
```

## Conclusion
Make sure to check the /var/log/fail2ban.log for any errors on startup or shutdown in adding ban rules, or removing rules on cleanup.  If there are any errors then the bans are likely not happening properly.  If you see lots of login activity in your /var/log/auth.log then the bans aren't working!


---
