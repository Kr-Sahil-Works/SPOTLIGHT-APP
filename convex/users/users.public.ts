import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const createOrUpdateUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    fullname: v.string(),
    image: v.string(),
  },
handler: async (ctx, args) => {
  const existing = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) =>
      q.eq("clerkId", args.clerkId)
    )
    .first();

  const cleanName =
    args.fullname
      ?.toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "") || "user";

  const random = Math.floor(100 + Math.random() * 900);
  const baseUsername = `${cleanName}${random}`;

  let username = baseUsername;
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

  /* =========================
     ✅ IF EXISTS → UPDATE ONLY
  ========================= */
  if (existing) {
    await ctx.db.patch(existing._id, {
      fullname: args.fullname,
      email: args.email,
      image: args.image,

      // 🔥 only set username if not already set properly
      ...(existing.username === "user"
        ? { username }
        : {}),
    });

    return existing._id;
  }

  /* =========================
     🆕 CREATE NEW USER
  ========================= */
  return await ctx.db.insert("users", {
    username,
    fullname: args.fullname,
    email: args.email,
    image: args.image,

    clerkId: args.clerkId,

    bio: "",
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
}
});