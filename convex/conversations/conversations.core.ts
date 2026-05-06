import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";

/* =========================
   🔑 BUILD KEY
========================= */
export function buildConversationKey(
  a: Id<"users">,
  b: Id<"users">
) {
  return [a, b].sort().join("_");
}

/* =========================
   🔍 FIND BY KEY
========================= */
export async function findConversationByKey(
  ctx: QueryCtx | MutationCtx,
  conversationKey: string
) {
  return await ctx.db
    .query("conversations")
    .withIndex("by_key", (q: any) =>
      q.eq("conversationKey", conversationKey)
    )
    .first();
}

/* =========================
   🔥 CREATE
========================= */
export async function createConversationInternal(
  ctx: MutationCtx,
  participants: Id<"users">[]
) {
  const conversationKey = participants.sort().join("_");

  return await ctx.db.insert("conversations", {
    participants,
    conversationKey,
    createdAt: Date.now(),

    // ✅ defaults
    type: "private",
    themeIndex: 0,
    updatedAt: Date.now(),
  });
}

/* =========================
   🔁 GET OR CREATE
========================= */
export async function getOrCreateConversationInternal(
  ctx: MutationCtx,
  currentUserId: Id<"users">,
  otherUserId: Id<"users">
) {
  const key = buildConversationKey(currentUserId, otherUserId);

  const existing = await findConversationByKey(ctx, key);

  if (existing) return existing._id;

  return await createConversationInternal(ctx, [
    currentUserId,
    otherUserId,
  ]);
}

/* =========================
   🧹 CLEAR CHAT
========================= */
export async function clearChatInternal(
  ctx: MutationCtx,
  conversationId: Id<"conversations">,
  userId: Id<"users">
) {
  const convo = await ctx.db.get(conversationId);

  const updated = [
    ...(convo?.clearedAt || []),
    { userId, timestamp: Date.now() },
  ];

  await ctx.db.patch(conversationId, {
    clearedAt: updated,
  });
}

/* =========================
   ❌ DELETE FOR USER
========================= */
export async function deleteChatInternal(
  ctx: MutationCtx,
  conversationId: Id<"conversations">,
  userId: Id<"users">
) {
  const convo = await ctx.db.get(conversationId);

  const updated = [...(convo?.deletedFor || []), userId];

  await ctx.db.patch(conversationId, {
    deletedFor: updated,
  });
}

/* =========================
   🔕 MUTE
========================= */
export async function toggleMuteInternal(
  ctx: MutationCtx,
  conversationId: Id<"conversations">,
  userId: Id<"users">
) {
  const convo = await ctx.db.get(conversationId);

  const list = convo?.mutedFor || [];

  const updated = list.includes(userId)
    ? list.filter((id) => id !== userId)
    : [...list, userId];

  await ctx.db.patch(conversationId, {
    mutedFor: updated,
  });
}

/* =========================
   📌 PIN
========================= */
export async function togglePinInternal(
  ctx: MutationCtx,
  conversationId: Id<"conversations">,
  userId: Id<"users">
) {
  const convo = await ctx.db.get(conversationId);

  const list = convo?.pinnedFor || [];

  const updated = list.includes(userId)
    ? list.filter((id) => id !== userId)
    : [...list, userId];

  await ctx.db.patch(conversationId, {
    pinnedFor: updated,
  });
}

/* =========================
   👻 HIDE
========================= */
export async function toggleHiddenInternal(
  ctx: MutationCtx,
  conversationId: Id<"conversations">,
  userId: Id<"users">
) {
  const convo = await ctx.db.get(conversationId);

  const list = convo?.hiddenFor || [];

  const updated = list.includes(userId)
    ? list.filter((id) => id !== userId)
    : [...list, userId];

  await ctx.db.patch(conversationId, {
    hiddenFor: updated,
  });
}

/* =========================
   🔍 GET CONVERSATION (BY USERS)
========================= */
export async function getConversationInternal(
  ctx: QueryCtx,
  currentUserId: Id<"users">,
  otherUserId: Id<"users">
) {
  const key = buildConversationKey(currentUserId, otherUserId);

  return await ctx.db
    .query("conversations")
    .withIndex("by_key", (q: any) =>
      q.eq("conversationKey", key)
    )
    .first();
}