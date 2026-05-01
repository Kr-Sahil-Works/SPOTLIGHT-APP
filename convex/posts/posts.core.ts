import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getAuthenticatedUser } from "../users";

/* =========================
   📤 UPLOAD URL
========================= */
export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  return await ctx.storage.generateUploadUrl();
});

/* =========================
   ➕ CREATE POST
========================= */
export const createPost = mutation({
  args: {
    caption: v.optional(v.string()),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) throw new Error("Image not found");

   const postId = await ctx.db.insert("posts", {
  userId: user._id,
  imageUrl,
  storageId: args.storageId,
  caption: args.caption,
  likes: 0,
  comments: 0,
  createdAt: Date.now(),
});

// ✅ update post count
await ctx.db.patch(user._id, {
  posts: user.posts + 1,
});

return postId;
  },
});

/* =========================
   🗑 DELETE POST
========================= */
export const deletePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    if (post.userId !== user._id) {
      throw new Error("Not authorized");
    }

    await ctx.storage.delete(post.storageId);
    await ctx.db.patch(user._id, {
  posts: Math.max(0, user.posts - 1),
});
    await ctx.db.delete(args.postId);
  },
});