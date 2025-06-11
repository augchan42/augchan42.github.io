---
# _posts/2025-06-10-revenuecat-web-billing-integration.md
layout: post
title: "Integrating RevenueCat Web Billing in React/Next.js: A Practical Guide"
author: "Aug"
date: 2025-06-11
header-style: text
catalog: true
description: "A step-by-step guide to integrating RevenueCat Web Billing in a plain React/Next.js app. Covers account setup, SDK usage, code samples, and key gotchas for a smooth subscription experience."
tags:
  - revenuecat
  - stripe
  - react
  - nextjs
  - web-billing
  - subscriptions
  - payments
  - frontend
  - developer-experience
---

**Abstract:**  
This post walks through integrating RevenueCat Web Billing into a plain React/Next.js app. It covers the full setup: creating accounts, configuring products, using the RevenueCat Web SDK, and handling entitlements. Code samples are provided, and key gotchas (like the need for both Stripe and RevenueCat accounts, and using the sandbox API key for development) are highlighted. No paywall is implemented—this is a pure integration guide.

**Estimated reading time:** _4 minutes_

# Integrating RevenueCat Web Billing in React/Next.js: A Practical Guide

If you want to add subscriptions or one-time purchases to your web app, RevenueCat is a great option. It abstracts away the complexity of payment providers (like Stripe) and gives you a unified API for managing products, purchases, and entitlements. Here's how I set it up in a plain React/Next.js project.

## What You Need

- **A Stripe account** (for payment processing; RevenueCat uses Stripe under the hood for web billing)
- **A RevenueCat account** ([Sign up here](https://app.revenuecat.com/))
- **A React or Next.js project** (no paywall or advanced backend required for this guide)
- **The RevenueCat Web SDK**
- **Your RevenueCat sandbox public API key** (for development/testing)

## Step 1: Create a RevenueCat Project

1. Go to the [RevenueCat dashboard](https://app.revenuecat.com/).
2. Create a new project for your app.

## Step 2: Configure Products and Entitlements

- In RevenueCat, add your products (subscriptions or one-time purchases).
- Set up entitlements and link them to your products.
- For web billing, you'll use RevenueCat's hosted checkout (not Stripe directly).

## Step 3: Get Your API Keys

- Go to Project Settings > API Keys.
- **Use the Sandbox API Key** for all development and testing.
- You'll switch to the Production key when you go live.
- Do not use the **Public API Key**, you will get errors (rcb_).  I don't know why, I had to open a ticket and they told me to use **Sandbox API Key**, rcb_sb_...

## Step 4: Install and Initialize the RevenueCat SDK

Install the SDK:

```bash
npm install @revenuecat/purchases-js
```

> **Note:** The RevenueCat Web SDK is designed to be used **client-side only**. Do not try to use it in Next.js API routes, getServerSideProps, or any server-side code—it will not work. Always initialize and call it from your React components or client-side hooks.

Initialize it in your app (e.g., in a top-level component or custom hook):

```js
import Purchases from '@revenuecat/purchases-js';

// Use your sandbox public API key for development
type RevenueCatConfig = {
  apiKey: string;
};

Purchases.configure({ apiKey: 'your_sandbox_public_api_key' });
```

## Step 5: Implement Web Billing (Hosted Checkout)

When a user wants to purchase, call the SDK's purchase method. RevenueCat will handle the checkout flow:

```js
// Trigger a purchase for a product (by its identifier)
await Purchases.purchaseProduct('product_identifier');
```

RevenueCat will open a hosted checkout page and return the result to your app.

## Step 6: Check Entitlements

After a purchase, check the user's entitlements to see if they have access:

```js
const customerInfo = await Purchases.getCustomerInfo();
const hasAccess = customerInfo.entitlements.active['your_entitlement_id']?.isActive;

if (hasAccess) {
  // Grant access to premium features
}
```

## Step 7: Testing

- Always use the **sandbox API key** for development and testing.
- RevenueCat provides a sandbox environment for simulating purchases.

## (Optional) Step 8: Webhooks

- For advanced use, set up webhooks in RevenueCat to notify your backend of purchase events.

## Key Points and Gotchas

- You **do not** need to integrate Stripe directly—RevenueCat handles the payment flow for you.
- You **must** have both a Stripe account (for payment processing) and a RevenueCat account (for product/entitlement management).
- Use the **sandbox API key** for all development and testing. Switch to the production key only for live users.
- Your app should check entitlements via the SDK to determine access—don't rely on local state alone.
- This guide does **not** implement a paywall; it's focused on the integration itself.
- The RevenueCat Web SDK is **client-side only**. Do not attempt to use it in server-side code (API routes, getServerSideProps, etc.)—it will not work.

## Conclusion

RevenueCat makes it much easier to add subscriptions and purchases to your web app, especially if you want to avoid the complexity of direct Stripe integration. Their Web SDK and hosted checkout flow are straightforward, and the entitlement system is robust. Just remember to use the sandbox key for testing, and check entitlements after every purchase.

Thanks for reading! 