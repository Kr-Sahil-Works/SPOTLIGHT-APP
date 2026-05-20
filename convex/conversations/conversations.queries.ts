import { v } from "convex/values";
import { MutationCtx, query, QueryCtx } from "../_generated/server";

type Ctx = QueryCtx | MutationCtx;

export async function getAuthenticatedUser(ctx: Ctx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error("Not authenticated");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) =>
      q.eq("clerkId", identity.subject)
    )
    .first();

  if (!user) throw new Error("User not found");

  return user;
}

export const getConversation =
  query({
    args: {
      conversationId:
        v.id(
          "conversations"
        ),
    },

    handler: async (
      ctx,
      args
    ) => {
      return await ctx.db.get(
        args.conversationId
      );
    },
  });