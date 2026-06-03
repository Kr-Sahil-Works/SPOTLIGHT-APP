import { v } from "convex/values";
import { api } from "../_generated/api";
import { mutation, query } from "../_generated/server";
import { getAuthenticatedUser } from "../users";

/* =========================
   ❤️ TOGGLE LIKE
========================= */
export const toggleLike = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const existing = await ctx.db
      .query("likes")
      .withIndex("by_user_and_post", (q) =>
        q.eq("userId", user._id).eq("postId", args.postId)
      )
      .first();

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

 if (existing) {
  await ctx.db.delete(existing._id);

  await ctx.db.patch(args.postId, {
    likes: Math.max(0, (post.likes || 0) - 1),
  });

  return false;
}

  await ctx.db.insert(
  "likes",
  {
    userId: user._id,
    postId: args.postId,
    createdAt:
      Date.now(),
  }
);
await ctx.db.patch(args.postId, {
  likes: (post.likes || 0) + 1,
});
    if (user._id !== post.userId) {
      await ctx.db.insert("notifications",
         {
        receiverId: post.userId,
        senderId: user._id,
        type: "like",
        isRead: false,
        postId: args.postId,
        createdAt: Date.now(),
      });

      const receiver =
  await ctx.db.get(
    post.userId
  );

if (receiver?.pushToken) {
  await ctx.scheduler.runAfter(
    0,
    api.social.index.sendSocialPush,
    {
      token:
        receiver.pushToken,

      title:
        "New Like ❤️",

      body:
        `${user.fullname} liked your post`,

      data: {
        type: "like",
        postId:
          args.postId,
      },
    }
  );
}

    }

    return true;
  },
});

export const getPostLikes = query({
  args: {
    postId: v.id("posts"),
  },

  handler: async (
    ctx,
    args
  ) => {
    const likes =
      await ctx.db
        .query("likes")
        .withIndex(
          "by_post",
          (q) =>
            q.eq(
              "postId",
              args.postId
            )
        )
        .order("desc")
.collect();

    const users =
      await Promise.all(
        likes.map((like) =>
          ctx.db.get(
            like.userId
          )
        )
      );

    return likes
  .map((like) => {
    const user = users.find(
      (u) =>
        u?._id ===
        like.userId
    );

    if (!user)
      return null;

    return {
      _id: user._id,

      username:
        user.username,

      fullname:
        user.fullname,

      image:
        user.image,

      likedAt:
        like.createdAt,
    };
  })
.filter(
  (
    item
  ): item is {
    _id: any;
    username: string;
    fullname: string;
    image: string;
    likedAt: number;
  } => item !== null
);
  },
});