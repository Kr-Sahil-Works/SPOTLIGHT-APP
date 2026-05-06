import { v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import {
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "../_generated/server";

/* =========================
   🔐 AUTH (QUERY)
========================= */
export async function getAuthenticatedUserQuery(
  ctx: QueryCtx
): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) =>
      q.eq("clerkId", identity.subject)
    )
    .first();

  if (!user || user.isDeleted) return null;

  return user;
}

/* =========================
   🔥 ENSURE USER
========================= */
export async function ensureUser(
  ctx: MutationCtx
): Promise<Doc<"users">> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  const existing = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) =>
      q.eq("clerkId", identity.subject)
    )
    .first();

  if (existing) return existing;

  /* =========================
     🆕 SAFE CLERK PARSE
  ========================= */

  // ✅ EMAIL
  let email = "";
  if (Array.isArray(identity.emailAddresses)) {
    const first = identity.emailAddresses[0] as any;
    email = String(first?.emailAddress || "");
  }

  // ✅ SAFE STRINGS
  const firstName = String(identity.firstName || "");
  const lastName = String(identity.lastName || "");
  const imageUrl = String(identity.imageUrl || "");

  // ✅ FULL NAME
  const fullname =
    [firstName, lastName].filter(Boolean).join(" ") ||
    email.split("@")[0] ||
    "User";

  // ✅ USERNAME BASE
  const baseUsername = email.split("@")[0] || "user";

  let username = baseUsername.toLowerCase();
  let count = 0;

  while (
    await ctx.db
      .query("users")
      .withIndex("by_username", (q) =>
        q.eq("username", username)
      )
      .first()
  ) {
    count++;
    username = `${baseUsername}${count}`;
  }

  const id = await ctx.db.insert("users", {
    username,
    fullname,
    email,
    bio: "",
    image: imageUrl,

    clerkId: identity.subject,

    followers: 0,
    following: 0,
    posts: 0,

    isPrivate: false,
    isOnline: true,
    lastSeen: Date.now(),
    lastActiveAt: Date.now(),
    showOnline: true,

    accountType: "user",

    createdAt: Date.now(),
  });

  const created = await ctx.db.get(id);
  if (!created) throw new Error("User creation failed");

  return created;
}

/* =========================
   🔐 AUTH (MUTATION)
========================= */
export async function getAuthenticatedUser(
  ctx: MutationCtx
): Promise<Doc<"users">> {
  const user = await ensureUser(ctx);

  if (user.isDeleted) {
    throw new Error("User deactivated");
  }

  return user;
}

/* =========================
   👤 CURRENT USER
========================= */
export const getCurrentUser = query({
  handler: async (ctx) => {
    return await getAuthenticatedUserQuery(ctx);
  },
});

/* =========================
   🧊 DEACTIVATE
========================= */
export const deactivateUser = mutation({
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);

    if (user.isDeleted) return;

    await ctx.db.patch(user._id, {
      isDeleted: true,
      deletedAt: Date.now(),
      isOnline: false,
    });
  },
});

/* =========================
   ♻️ REACTIVATE
========================= */
export const reactivateUser = mutation({
  handler: async (ctx) => {
    const user = await ensureUser(ctx);

    if (!user.isDeleted) return;

    const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

    if (
      user.deletedAt &&
      Date.now() - user.deletedAt > THIRTY_DAYS
    ) {
      throw new Error("Account permanently deleted");
    }

    await ctx.db.patch(user._id, {
      isDeleted: false,
      deletedAt: undefined,
      isOnline: true,
      lastActiveAt: Date.now(),
    });
  },
});

/* =========================
   🔔 PUSH TOKEN
========================= */
export const savePushToken = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (user.pushToken === args.token) return;

    await ctx.db.patch(user._id, {
      pushToken: args.token,
    });
  },
});