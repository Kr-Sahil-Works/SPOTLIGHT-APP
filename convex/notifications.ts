import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

/* =========================
   🔔 GET NOTIFICATIONS
========================= */
export const getNotifications = query({
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);

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

    return notifications.map((n) => {
      const sender = senderMap.get(n.senderId.toString());

      return {
        ...n,
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
    const user = await getAuthenticatedUser(ctx);

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