import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getAuthenticatedUser } from "../users";

export const toggleReaction = mutation({
  args: {
    messageId: v.id("messages"),
    reaction: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const msg = await ctx.db.get(args.messageId);
    if (!msg) return;

    const reactions = msg.reactions || [];
const filtered = reactions.filter(
  (r) => r.userId.toString() !== user._id.toString()
);

    const existing = reactions.find(
      (r) =>
        r.userId.toString() === user._id.toString() &&
        r.value === args.reaction
    );

   await ctx.db.patch(args.messageId, {
  reactions: existing
    ? filtered
    : [...filtered, { userId: user._id, value: args.reaction }],
})
  },
});