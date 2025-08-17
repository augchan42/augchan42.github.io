---
layout: post
title: "Getting Browser Tools MCP Server Working with Claude Code: A Simple 2-Step Solution"
date: 2025-08-02
description: "Quick guide to configure browser-tools-mcp AgentDeskAI with Claude Code - solving connection issues and getting your MCP server properly integrated."
tags:
  [
    Claude,
    MCP,
    Browser-Tools,
    AgentDeskAI,
    Development-Tools,
    AI-Assisted-Coding,
    Configuration,
    Troubleshooting,
  ]
---

**Abstract:**  
This post provides a straightforward solution for configuring the browser-tools MCP server with Claude Code. When your MCP server fails to connect with `claude mcp list`, the issue is typically that Claude doesn't know how to find or start the server. This guide walks through the simple 2-step process to get everything working properly.

**Estimated reading time:** _3 minutes_

Getting MCP servers properly configured can sometimes be tricky, especially when dealing with stdio-based servers like the browser-tools MCP from AgentDeskAI. This post addresses a common issue where the MCP server appears to be failing to connect, when in reality it just needs to be properly registered with Claude.

## The Problem: MCP Server Connection Failures

When you run `claude mcp list` and see connection failures for your browser-tools MCP server, it's easy to assume there's a complex networking or configuration issue. However, the root cause is often much simpler: **Claude doesn't know how to find or start the MCP server**.

The browser-tools MCP server from AgentDeskAI is a stdio-based server, which means it communicates via stdin/stdout rather than listening on network ports. This type of server requires explicit registration with Claude to work properly.

**Important clarification:** There are actually two separate server components in the browser-tools ecosystem:

1. **`@agentdeskai/browser-tools-mcp`** - This is the **MCP Server** that implements the Model Context Protocol and provides standardized tools for AI clients.

2. **`@agentdeskai/browser-tools-server`** - This is the **Node.js middleware server** that acts as a bridge between the MCP server and the Chrome extension. It handles the actual browser tools functionality like gathering logs, taking screenshots, and running audits.

The complete architecture flows like this: **Claude Code (MCP Client)** → MCP Server → Node Server → Chrome Extension → Browser

## The Solution: 2 Simple Steps

### Step 1: Verify the MCP Server and Node Server are Working

First, let's confirm that both server components are functioning correctly (this assumes you've already installed the browser extension as described in https://browsertools.agentdesk.ai/installation):

**Start the Node.js middleware server:**
```bash
npx @agentdeskai/browser-tools-server@1.2.0
```

**Test the MCP server independently:**
```bash
npx @agentdeskai/browser-tools-mcp@latest
```

**Expected behavior:** The server should output discovery messages and then appear to "hang" - this is actually normal behavior. The server is waiting for MCP protocol communication via stdin/stdout.

**Example output:**

```
(node:241865) ExperimentalWarning: CommonJS module /home/hosermage/.nvm/versions/node/v23.3.0/lib/node_modules/npm/node_modules/debug/src/node.js is loading ES Module /home/hosermage/.nvm/versions/node/v23.3.0/lib/node_modules/npm/node_modules/supports-color/index.js using require().
Support for loading ES Module in require() is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Attempting initial server discovery on startup...
Starting server discovery process
Will try hosts: 127.0.0.1, 127.0.0.1, localhost
Will try ports: 3025, 3026, 3027, 3028, 3029, 3030, 3031, 3032, 3033, 3034, 3035
Checking 127.0.0.1:3025...
Successfully found server at 127.0.0.1:3025
Successfully discovered server at 127.0.0.1:3025
```

This output shows that the MCP server is:

1. **Performing server discovery** - scanning localhost on ports 3025-3035
2. **Finding the Node.js middleware server** - successfully connecting to the HTTP server at `127.0.0.1:3025`
3. **Ready for MCP communication** - waiting for protocol messages via stdin/stdout

The "hang" at the end is expected - the MCP server is waiting for MCP protocol input. You can safely terminate this process with Ctrl+C once you've confirmed it's working.

**Important:** The MCP server needs the Node.js middleware server (`browser-tools-server`) to be running first, as it acts as the bridge between the MCP server and the Chrome extension.

If you see error messages or the server exits immediately, there might be an issue with the installation or dependencies. In that case, ensure you have Node.js installed and try reinstalling the package.

### Step 2: Add the MCP Server to Claude

The key step is registering the MCP server with Claude so it knows how to start and communicate with it:

```bash
claude mcp add browser-tools npx -- @agentdeskai/browser-tools-mcp@latest
```

**Important details:**

- **Server name:** `browser-tools` (you can choose any name you prefer)
- **Command:** `npx -- @agentdeskai/browser-tools-mcp@latest`
- **Double dash (`--`):** This is crucial - it properly separates the npx arguments from the claude mcp arguments

## Key Technical Points

### Understanding the Two-Server Architecture

The browser-tools system uses a two-server design that separates concerns:

- **MCP Server (`browser-tools-mcp`):** Handles the Model Context Protocol communication with Claude Code (the MCP client) via stdin/stdout
- **Node.js Server (`browser-tools-server`):** Acts as middleware that communicates with the Chrome extension and provides the actual browser tools functionality

This design has several advantages:
- **Separation of concerns:** The MCP server focuses on protocol handling, while the Node.js server handles browser interactions
- **Flexibility:** The Node.js server can be used independently by other tools
- **Reliability:** If the MCP server restarts, the Node.js server continues running

### The Role of the Double Dash

The `--` in the command is essential because it tells the shell to treat everything after it as arguments to the `npx` command, rather than arguments to the `claude mcp add` command. Without it, the command parsing can fail.

### How the Servers Work Together

The MCP server connects to the Node.js server (typically running on port 3025) for the actual browser tools functionality. The Node.js server acts as a bridge between the MCP server and the Chrome extension, handling tasks like taking screenshots, gathering console logs, and running audits.

**Important Prerequisite:** Before Claude Code can access browser windows via browser-tools, you need to have the browser's developer tools opened. This is required for the browser tools to establish the necessary connection and permissions to interact with the page.

### What Happens When Claude Runs the Server

When you register the MCP server with Claude Code, Claude spawns its own instance of the same process. This new instance goes through the exact same discovery process you witnessed when running it directly:

1. **Same discovery messages** - Claude's instance will show the same server discovery output
2. **Same connection to browser tools** - It will find and connect to the same HTTP server at `127.0.0.1:3025`
3. **Active MCP communication** - Unlike the direct command line version that "hangs" waiting for input, Claude actively communicates with the server using the MCP protocol

The key difference is that when you run it directly from the command line, it's just sitting there waiting for MCP protocol input (which is why it appears to "hang"). When Claude runs it, Claude actively communicates with it using the MCP protocol for browser automation tasks.

## Verification

After completing both steps, verify the configuration:

```bash
claude mcp list
```

You should now see output similar to:

```
browser-tools: npx @agentdeskai/browser-tools-mcp@latest - ✓ Connected
```

The checkmark indicates that Claude can successfully start and communicate with the MCP server.

## Troubleshooting Common Issues

### Server Still Shows as Disconnected

If the server still appears disconnected after following the steps:

1. **Check the command syntax:** Ensure the double dash is present and the package name is correct
2. **Verify Node.js installation:** The server requires Node.js to run
3. **Check for conflicting processes:** Ensure no other instances of the server are running
4. **Review Claude logs:** Look for any error messages in Claude's output

### Permission Issues

If you encounter permission errors:

1. **Check file permissions:** Ensure the npx command can execute
2. **Try global installation:** As an alternative, you can install the package globally and reference it directly
3. **Verify PATH:** Ensure npx is in your system PATH

## Conclusion

Configuring MCP servers with Claude Code doesn't have to be complicated. The key insight is understanding that the browser-tools system uses a two-server architecture where both components need to be running for everything to work properly. By following these two simple steps - starting the Node.js middleware server and then registering the MCP server with Claude - you can quickly get your browser tools up and running.

The browser-tools system is now ready to provide browser automation functionality through Claude Code, enabling powerful AI-assisted web interactions and testing scenarios.

---

_This configuration approach applies to other stdio-based MCP servers as well. The same principles of verification and registration can be used for any MCP server that communicates via stdin/stdout rather than network protocols._
