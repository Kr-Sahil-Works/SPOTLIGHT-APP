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
    .withIndex(
      "by_key",
      (q: any) =>
        q.eq(
          "conversationKey",
          conversationKey
        )
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
  const sortedParticipants =
    [...participants].sort();

  const now = Date.now();

  const conversationId =
    await ctx.db.insert(
      "conversations",
      {
        participants:
          sortedParticipants,

        conversationKey:
          sortedParticipants.join(
            "_"
          ),

        createdAt:
          now,

        // ✅ defaults
        type: "private",

        themeIndex: 0,

        updatedAt:
          now,

        // 🔔 unread counters
        unreadCounts:
          sortedParticipants.map(
            (userId) => ({
              userId,
              count: 0,
            })
          ),
      }
    );

  /* =========================
     👥 CREATE MEMBERS
  ========================= */

  await Promise.all(
    sortedParticipants.map(
      (userId) =>
        ctx.db.insert(
          "conversationMembers",
          {
            conversationId,
            userId,
          }
        )
    )
  );

  return conversationId;
}

/* =========================
   🔁 GET OR CREATE
========================= */
export async function getOrCreateConversationInternal(
  ctx: MutationCtx,
  currentUserId: Id<"users">,
  otherUserId: Id<"users">
) {
  const key =
    buildConversationKey(
      currentUserId,
      otherUserId
    );

  const existing =
    await findConversationByKey(
      ctx,
      key
    );

  if (existing) {
    /*
     * Existing conversations may have
     * been created before conversationMembers
     * was introduced.
     *
     * Make sure both member rows exist.
     */

    const existingMembers =
      await ctx.db
        .query(
          "conversationMembers"
        )
        .withIndex(
          "by_conversation",
          (q) =>
            q.eq(
              "conversationId",
              existing._id
            )
        )
        .collect();

    const existingUserIds =
      new Set(
        existingMembers.map(
          (member) =>
            String(member.userId)
        )
      );

    const missingUsers =
      existing.participants.filter(
        (userId) =>
          !existingUserIds.has(
            String(userId)
          )
      );

    if (
      missingUsers.length > 0
    ) {
      await Promise.all(
        missingUsers.map(
          (userId) =>
            ctx.db.insert(
              "conversationMembers",
              {
                conversationId:
                  existing._id,

                userId,
              }
            )
        )
      );
    }

    /*
     * Make sure old conversations
     * also have unreadCounts.
     */
    if (
      !existing.unreadCounts
    ) {
      await ctx.db.patch(
        existing._id,
        {
          unreadCounts:
            existing.participants.map(
              (userId) => ({
                userId,
                count: 0,
              })
            ),
        }
      );
    }

    return existing._id;
  }

  return await createConversationInternal(
    ctx,
    [
      currentUserId,
      otherUserId,
    ]
  );
}

/* =========================
   🧹 CLEAR CHAT
========================= */
export async function clearChatInternal(
  ctx: MutationCtx,
  conversationId: Id<"conversations">,
  userId: Id<"users">
) {
  const convo =
    await ctx.db.get(
      conversationId
    );

  const updated = [
    ...(convo?.clearedAt || []),
    {
      userId,
      timestamp: Date.now(),
    },
  ];

  await ctx.db.patch(
    conversationId,
    {
      clearedAt: updated,
    }
  );
}

/* =========================
   ❌ DELETE FOR USER
========================= */
export async function deleteChatInternal(
  ctx: MutationCtx,
  conversationId: Id<"conversations">,
  userId: Id<"users">
) {
  const convo =
    await ctx.db.get(
      conversationId
    );

  const updated = [
    ...(convo?.deletedFor || []),
    userId,
  ];

  await ctx.db.patch(
    conversationId,
    {
      deletedFor: updated,
    }
  );
}

/* =========================
   🔕 MUTE
========================= */
export async function toggleMuteInternal(
  ctx: MutationCtx,
  conversationId: Id<"conversations">,
  userId: Id<"users">
) {
  const convo =
    await ctx.db.get(
      conversationId
    );

  const list =
    convo?.mutedFor || [];

  const updated = list.includes(
    userId
  )
    ? list.filter(
        (id) => id !== userId
      )
    : [...list, userId];

  await ctx.db.patch(
    conversationId,
    {
      mutedFor: updated,
    }
  );
}

/* =========================
   📌 PIN
========================= */
export async function togglePinInternal(
  ctx: MutationCtx,
  conversationId: Id<"conversations">,
  userId: Id<"users">
) {
  const convo =
    await ctx.db.get(
      conversationId
    );

  const list =
    convo?.pinnedFor || [];

  const updated = list.includes(
    userId
  )
    ? list.filter(
        (id) => id !== userId
      )
    : [...list, userId];

  await ctx.db.patch(
    conversationId,
    {
      pinnedFor: updated,
    }
  );
}

/* =========================
   👻 HIDE
========================= */
export async function toggleHiddenInternal(
  ctx: MutationCtx,
  conversationId: Id<"conversations">,
  userId: Id<"users">
) {
  const convo =
    await ctx.db.get(
      conversationId
    );

  const list =
    convo?.hiddenFor || [];

  const updated = list.includes(
    userId
  )
    ? list.filter(
        (id) => id !== userId
      )
    : [...list, userId];

  await ctx.db.patch(
    conversationId,
    {
      hiddenFor: updated,
    }
  );
}

/* =========================
   🔍 GET CONVERSATION (BY USERS)
========================= */
export async function getConversationInternal(
  ctx: QueryCtx,
  currentUserId: Id<"users">,
  otherUserId: Id<"users">
) {
  const key =
    buildConversationKey(
      currentUserId,
      otherUserId
    );

  return await ctx.db
    .query("conversations")
    .withIndex(
      "by_key",
      (q: any) =>
        q.eq(
          "conversationKey",
          key
        )
    )
    .first();
}