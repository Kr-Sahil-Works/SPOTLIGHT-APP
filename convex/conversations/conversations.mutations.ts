import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getAuthenticatedUser } from "../users/users.core";

import {
    clearChatInternal,
    deleteChatInternal,
    getOrCreateConversationInternal,
    toggleHiddenInternal,
    toggleMuteInternal,
    togglePinInternal,
} from "./conversations.core";

/* =========================
   💬 CREATE
========================= */
export const createConversation = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const current = await getAuthenticatedUser(ctx);

    return await getOrCreateConversationInternal(
      ctx,
      current._id,
      args.userId
    );
  },
});

/* =========================
   🧹 CLEAR
========================= */
export const clearChat = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const current = await getAuthenticatedUser(ctx);

    await clearChatInternal(
      ctx,
      args.conversationId,
      current._id
    );
  },
});

/* =========================
   ❌ DELETE
========================= */
export const deleteChat = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const current = await getAuthenticatedUser(ctx);

    await deleteChatInternal(
      ctx,
      args.conversationId,
      current._id
    );
  },
});

/* =========================
   🔕 MUTE
========================= */
export const toggleMute = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const current = await getAuthenticatedUser(ctx);

    await toggleMuteInternal(
      ctx,
      args.conversationId,
      current._id
    );
  },
});

/* =========================
   📌 PIN
========================= */
export const togglePin = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const current = await getAuthenticatedUser(ctx);

    await togglePinInternal(
      ctx,
      args.conversationId,
      current._id
    );
  },
});

/* =========================
   👻 HIDE
========================= */
export const toggleHidden = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const current = await getAuthenticatedUser(ctx);

    await toggleHiddenInternal(
      ctx,
      args.conversationId,
      current._id
    );
  },
});