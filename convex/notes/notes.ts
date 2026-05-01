import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthenticatedUser } from "../users";

export const saveNote = mutation({
  args: { content: v.string() },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const existing = await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    await ctx.db.insert("notes", {
      userId: user._id,
      content: args.content.trim(),
      updatedAt: Date.now(),
      order: existing.length,
      pinned: false,
    });
  },
});

export const getNotes = query({
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);

    const notes = await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return notes.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return a.order - b.order;
    });
  },
});

export const deleteNote = mutation({
  args: { noteId: v.id("notes") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const note = await ctx.db.get(args.noteId);
    if (!note) throw new Error("Note not found");

    if (note.userId !== user._id) {
      throw new Error("Not allowed");
    }

    await ctx.db.delete(args.noteId);
  },
});

export const updateNote = mutation({
  args: {
    noteId: v.id("notes"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const note = await ctx.db.get(args.noteId);
    if (!note) throw new Error("Note not found");

    if (note.userId !== user._id) {
      throw new Error("Not allowed");
    }

    const content = args.content.trim();
    if (!content) throw new Error("Empty note");

    await ctx.db.patch(args.noteId, {
      content,
      updatedAt: Date.now(),
    });
  },
});


export const togglePinNote = mutation({
  args: { noteId: v.id("notes") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const note = await ctx.db.get(args.noteId);
    if (!note) throw new Error("Note not found");

    if (note.userId !== user._id) {
      throw new Error("Not allowed");
    }

    await ctx.db.patch(args.noteId, {
      pinned: !note.pinned,
    });
  },
});

export const reorderNotes = mutation({
  args: {
    orderedIds: v.array(v.id("notes")),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    await Promise.all(
      args.orderedIds.map((id, index) =>
        ctx.db.patch(id, { order: index })
      )
    );
  },
});

