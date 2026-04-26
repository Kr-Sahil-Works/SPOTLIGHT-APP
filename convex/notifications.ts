import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";


// 🔥 GET ALL NOTIFICATIONS
export const getNotifications = query({
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_receiver", (q) =>
        q.eq("receiverId", currentUser._id)
      )
      .order("desc")
      .collect();

const notificationsWithInfo = [];

for (const notification of notifications) {
  const sender = await ctx.db.get(notification.senderId);

  // ❌ skip instead of returning null
  if (!sender) continue;

  let post = null;
  let comment = null;

  if (notification.postId) {
    post = await ctx.db.get(notification.postId);
  }

  if (
    notification.type === "comment" &&
    notification.commentId
  ) {
    const c = await ctx.db.get(notification.commentId);
    comment = c?.content;
  }

  notificationsWithInfo.push({
    ...notification,

    // ✅ always defined
    isRead: notification.isRead ?? true,

    sender: {
      _id: sender._id,
      username: sender.username,
      image: sender.image,
    },

    post,
    comment,
  });
}
return notificationsWithInfo;
  },
});


// 🔥 UNREAD COUNT (for badge)
export const getUnreadCount = query({
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);

    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_receiver", (q) =>
        q.eq("receiverId", user._id)
      )
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect();

    return unread.length;
  },
});


// 🔥 MARK ALL AS READ
export const markAllAsRead = mutation({
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);

    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_receiver", (q) =>
        q.eq("receiverId", user._id)
      )
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect();

    await Promise.all(
      unread.map((n) =>
        ctx.db.patch(n._id, { isRead: true })
      )
    );
  },
});