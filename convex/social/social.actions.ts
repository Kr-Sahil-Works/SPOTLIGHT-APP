import { v } from "convex/values";
import { action } from "../_generated/server";

export const sendSocialPush = action({
  args: {
    token: v.string(),
    title: v.string(),
    body: v.string(),
    data: v.optional(v.any()),
  },

  handler: async (_, args) => {
    const response = await fetch(
      "https://exp.host/--/api/v2/push/send",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: args.token,
          sound: "default",
          title: args.title,
          body: args.body,
          data: args.data,
        }),
      }
    );

    console.log(
      "SOCIAL PUSH",
      await response.text()
    );
  },
});