---
name: convex-create-component
description: Convex reactive real-time backend architecture: modular schemas, live queries, serverless mutations, and instant lead capture.
---

# CONVEX REACTIVE BACKEND & DATA ARCHITECTURE

## 1. Schema Definition Pattern (convex/schema.ts)
```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  leads: defineTable({
    name: v.string(),
    email: v.string(),
    requirements: v.string(),
    status: v.string(),
    createdAt: v.number()
  })
});
```
