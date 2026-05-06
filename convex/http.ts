import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET");
    }

    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("Missing svix headers", { status: 400 });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);

    let evt: any;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as any;
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return new Response("Invalid webhook", { status: 400 });
    }

    const eventType = evt.type;

    /* =========================
       👤 USER CREATED
    ========================= */
    if (eventType === "user.created") {
      const {
        id,
        email_addresses,
        first_name,
        last_name,
        image_url,
      } = evt.data;

      const email = email_addresses?.[0]?.email_address || "";

      const fullname =
        [first_name, last_name].filter(Boolean).join(" ") ||
        email.split("@")[0];

      // ✅ Call mutation (no ctx.db here)
      await ctx.runMutation(api.users.webhook.createUserFromWebhook, {
        clerkId: id,
        email,
        fullname,
        image: image_url,
      });
    }

    return new Response("Webhook processed", { status: 200 });
  }),
});

export default http;