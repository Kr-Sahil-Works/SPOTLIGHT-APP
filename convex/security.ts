import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const verifyDeveloperCode = mutation({
  args: {
    code: v.string(),
  },

  handler: async (_, args) => {
    return (
      args.code ===
      process.env.DEV_ACCESS_CODE
    );
  },
});

export const verifyAdminDeleteCode = mutation({
  args: {
    code: v.string(),
  },

  handler: async (_, args) => {
    return (
      args.code ===
      process.env.ADMIN_DELETE_CODE
    );
  },
});