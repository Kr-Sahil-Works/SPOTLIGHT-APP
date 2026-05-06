import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser, getAuthenticatedUserQuery } from "./users/users.core";

/* =========================
   🔔 GET NOTIFICATIONS
========================= */
export const getNotifications = query({
  handler: async (ctx) => {
const user = await getAuthenticatedUserQuery(ctx);
if (!user) return [];

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_receiver", (q) =>
        q.eq("receiverId", user._id)
      )
      .order("desc")
      .take(50); // 🔥 limit instead of collect

    if (notifications.length === 0) return [];

    // ⚡ batch senders
    const senderIds = [
      ...new Set(notifications.map(n => n.senderId)),
    ];

    const senders = await Promise.all(
      senderIds.map(id => ctx.db.get(id))
    );

    const senderMap = new Map(
      senders.map(s => [s?._id.toString(), s])
    );
const commentIds = notifications
  .map(n => n.commentId)
  .filter(Boolean);

const comments = await Promise.all(
  commentIds.map(id => ctx.db.get(id!))
);

const commentMap = new Map(
  comments.map(c => [c?._id.toString(), c])
);

const postIds = notifications
  .map(n => n.postId)
  .filter(Boolean);

const posts = await Promise.all(
  postIds.map(id => ctx.db.get(id!))
);

const postMap = new Map(
  posts.map(p => [p?._id.toString(), p])
);

return notifications.map((n) => {
  const sender = senderMap.get(n.senderId.toString());

  const comment = n.commentId
    ? commentMap.get(n.commentId.toString())
    : null;

  const post = n.postId
    ? postMap.get(n.postId.toString())
    : null;

  return {
    ...n,
    comment: comment?.content || null, // ✅ FIX
    post: post
      ? { imageUrl: post.imageUrl }
      : null, // ✅ FIX
    sender: sender
      ? {
          _id: sender._id,
          username: sender.username,
          image: sender.image,
        }
      : null,
  };
});
  },
});

/* =========================
   🔴 UNREAD COUNT
========================= */
export const getUnreadCount = query({
  handler: async (ctx) => {
const user = await getAuthenticatedUserQuery(ctx);
if (!user) return 0;

    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_receiver_read", (q) =>
  q.eq("receiverId", user._id).eq("isRead", false)
)
      .filter((q) => q.eq(q.field("isRead"), false))
      .take(999); // 🔥 limit

    return unread.length;
  },
});

/* =========================
   ✅ MARK ALL READ
========================= */
export const markAllAsRead = mutation({
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);

    const unread = await ctx.db
      .query("notifications")
   .withIndex("by_receiver_read", (q) =>
  q.eq("receiverId", user._id).eq("isRead", false)
)
      .filter((q) => q.eq(q.field("isRead"), false))
      .take(100);

    await Promise.all(
      unread.map((n) =>
        ctx.db.patch(n._id, { isRead: true })
      )
    );
  },
});