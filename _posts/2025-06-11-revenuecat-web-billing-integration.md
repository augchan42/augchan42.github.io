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
This post walks through integrating RevenueCat Web Billing into a plain React/Next.js app. It covers the full setup: creating accounts, configuring products, using the RevenueCat Web SDK, and handling entitlements. Code samples and a recommended context/component hierarchy are provided, along with key gotchas (like the need for both Stripe and RevenueCat accounts, and using the sandbox API key for development). No paywall is implemented—this is a pure integration guide.

**Estimated reading time:** _5 minutes_

# Integrating RevenueCat Web Billing in React/Next.js: A Practical Guide

If you want to add subscriptions or one-time purchases to your web app, RevenueCat is a great option. It abstracts away the complexity of payment providers (like Stripe) and gives you a unified API for managing products, purchases, and entitlements. Here's how I set it up in a plain React/Next.js project, with practical code and best practices.

---

## 1. RevenueCat Integration: Sample Code

### a. **Install the SDK**

```bash
npm install @revenuecat/purchases-js
```

---

### b. **Initialize RevenueCat (in a Context Provider)**

Create a context to provide RevenueCat's customer info and methods throughout your app.

**`src/contexts/RevenueCatContext.tsx`**
```tsx
// Filename: src/contexts/RevenueCatContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import Purchases, { CustomerInfo } from '@revenuecat/purchases-js';

const REVENUECAT_API_KEY = process.env.NEXT_PUBLIC_REVENUECAT_API_KEY!; // Use your sandbox key for dev

interface RevenueCatContextValue {
  customerInfo: CustomerInfo | null;
  isLoading: boolean;
  refreshCustomerInfo: () => Promise<void>;
}

const RevenueCatContext = createContext<RevenueCatContextValue | undefined>(undefined);

export const RevenueCatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCustomerInfo = async () => {
    setIsLoading(true);
    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
    } catch (e) {
      setCustomerInfo(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    Purchases.configure({ apiKey: REVENUECAT_API_KEY });
    refreshCustomerInfo();
  }, []);

  return (
    <RevenueCatContext.Provider value={{ customerInfo, isLoading, refreshCustomerInfo }}>
      {children}
    </RevenueCatContext.Provider>
  );
};

export const useRevenueCat = () => {
  const ctx = useContext(RevenueCatContext);
  if (!ctx) throw new Error('useRevenueCat must be used within RevenueCatProvider');
  return ctx;
};
```

> **Note:** The RevenueCat Web SDK is designed to be used **client-side only**. Do not try to use it in Next.js API routes, getServerSideProps, or any server-side code—it will not work. Always initialize and call it from your React components or client-side hooks.

---

### c. **Purchase Flow Example**

**`src/components/PurchaseButton.tsx`**
```tsx
// Filename: src/components/PurchaseButton.tsx
import React from 'react';
import Purchases from '@revenuecat/purchases-js';
import { useRevenueCat } from '@/contexts/RevenueCatContext';

export const PurchaseButton: React.FC<{ productId: string }> = ({ productId }) => {
  const { refreshCustomerInfo } = useRevenueCat();

  const handlePurchase = async () => {
    try {
      await Purchases.purchaseProduct(productId);
      await refreshCustomerInfo(); // Refresh entitlements after purchase
      alert('Purchase successful!');
    } catch (e: any) {
      alert('Purchase failed: ' + (e.message || e));
    }
  };

  return (
    <button onClick={handlePurchase}>
      Purchase
    </button>
  );
};
```

---

### d. **Checking Entitlements in a Component**

**`src/components/FeatureAccess.tsx`**
```tsx
// Filename: src/components/FeatureAccess.tsx
import React from 'react';
import { useRevenueCat } from '@/contexts/RevenueCatContext';

export const FeatureAccess: React.FC<{ entitlementId: string }> = ({ entitlementId }) => {
  const { customerInfo, isLoading } = useRevenueCat();

  if (isLoading) return <div>Loading...</div>;

  const hasAccess = !!customerInfo?.entitlements.active[entitlementId]?.isActive;

  return (
    <div>
      {hasAccess ? 'You have access to this feature!' : 'You do not have access.'}
    </div>
  );
};
```

---

## 2. Component/Context Hierarchy

**Recommended Hierarchy:**

```
<App>
  <RevenueCatProvider>
    <YourAppLayout>
      <FeatureAccess entitlementId="pro_feature" />
      <PurchaseButton productId="pro_feature_product_id" />
      {/* ...other components */}
    </YourAppLayout>
  </RevenueCatProvider>
</App>
```

- **`RevenueCatProvider`** should wrap your app (ideally at the top level, e.g., in `_app.tsx` or your main layout).
- All components that need to check entitlements or trigger purchases use the `useRevenueCat` hook.
- You can use the context to show/hide premium features, display purchase buttons, etc.

---

## 3. Key Points & Best Practices

- **API Key:** Use the sandbox key for development/testing. Switch to production key for live.
- **Entitlements:** Set up in RevenueCat dashboard and referenced by `entitlementId` in your code.
- **Products:** Use the product identifier you configured in RevenueCat for purchases.
- **Web Billing:** RevenueCat handles the checkout UI; you do not need to integrate Stripe directly.
- **Customer Info:** Always refresh after a purchase to update entitlements.
- **Context:** Centralizes RevenueCat state and avoids prop drilling.
- The RevenueCat Web SDK is **client-side only**. Do not attempt to use it in server-side code (API routes, getServerSideProps, etc.)—it will not work.
- You **must** have both a Stripe account (for payment processing) and a RevenueCat account (for product/entitlement management).
- The RevenueCat **Public API Key** (rcb_) is for production, you will get errors using it against the Stripe sandbox environment. Use the **Sandbox API Key** (rcb_sb_...) for development/testing.

---

## 4. References

- [RevenueCat Web SDK Docs](https://www.revenuecat.com/docs/web/overview)
- [Web Billing Setup](https://www.revenuecat.com/docs/web/web-checkout)
- [Entitlements Guide](https://www.revenuecat.com/docs/entitlements)

---
