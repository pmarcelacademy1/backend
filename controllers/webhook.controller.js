import User from "../models/user.model.js";
import { Webhook } from "svix";

export const clerkWebHook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Webhook secret is missing!");
    return res.status(500).json({ message: "Server configuration error" });
  }

  const payload = req.body;
  const headers = req.headers;

  console.log("Webhook received:", { payload: payload.toString(), headers });

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(payload, headers);
    console.log("Webhook verified:", evt.type);
  } catch (err) {
    console.error("Webhook verification failed:", err.message);
    return res.status(400).json({ message: "Webhook verification failed" });
  }

  if (evt.type === "user.created") {
    try {
      const userData = {
        clerkUserId: evt.data.id,
        username: evt.data.username || evt.data.email_addresses?.[0]?.email_address || `user_${evt.data.id}`,
        email: evt.data.email_addresses?.[0]?.email_address,
        img: evt.data.profile_image_url || evt.data.image_url || "",
      };

      const savedUser = await User.findOneAndUpdate(
        { clerkUserId: evt.data.id },
        userData,
        { upsert: true, new: true }
      );

      console.log("User saved/updated:", savedUser);
    } catch (err) {
      console.error("Failed to save user:", err.message);
      return res.status(500).json({ message: "Failed to save user" });
    }
  } else {
    console.log("Event ignored, type:", evt.type);
  }

  return res.status(200).json({ message: "Webhook received" });
};