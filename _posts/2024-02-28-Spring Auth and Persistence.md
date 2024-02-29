---
layout:       post
title:        "Spring JWT Authentication and Persistence"
author:       "Aug"
header-style: text
catalog:      true
tags:
    - Spring
    - JWT
    - JPA
    - Persistence
    - Security
---

With AI I've been able to implement Security and Persistence in Spring very quickly.  These are really notes for my own usage so I can better keep track of what the hell I did.

**Numerous Spring Abstractions and Annotations**

At my previous job working for a mid-sized enterprise software company, the Java app I used to work on was over 15 years old.  It pre-dated Spring and didn't use annotations (except for very small bits of later code used in the front end).  It could be deployed to JBoss, Websphere, or Weblogic.  It had its own db abstraction layer, custom security and authorization, etc.

With Spring a lot of that is handled for you (I'm using Spring Core 6, spring-boot-starter-data-jpa -> 3.0.4 for persistence, and org.springframework.boot:spring-boot-starter-security -> 3.0.4 for security).  You write a lot less code but for someone not familiar with Spring, they will get lost since the annotations pack a lot of functionality and
code behind the scenes.

I learned about @Entity, @Id, @GeneratedValue to create tables with auto incrementing
id columns.
Also learned about @CollectionTable and @JoinColumn for 1:Many child tables

By using these annotations, I don't need to write any jdbc code, or manage any database connections, or any SQL at all.  I didn't need to write any DDL to create the underlying tables either.

**Spring Security**

As for security, I learned about the Spring SecurityFilterChain to restrict url patterns, specify what roles are allowed to what patterns, and enable stateless Session Management.

Also learned about JWT for Stateless Authorization, loading a jwt secret from property which is then used to generate a signing key using HMAC-SHA.

User passwords are encrypted in the database with BCryptPasswordEncoder.

The Spring UserRepository is used to load credentials from the User table.  The Spring AuthenticationManager is used to authenticate the password from the login request against the
password from the db on login.  After authentication a jwt authentication token is returned along with the username, email, and profile info (name, title, etc).  The jwt needs to be passed as part of the header on subsequent requests to auth the session.

I tried navigating to the Spring AuthenticationManager impl code but wasn't able to (ctrl click on authenticate method in VSCode didn't work quite right for me).




