import { api } from "@/convex/_generated/api";
import { registerForPushNotificationsAsync } from "@/lib/notifications";
import { useMutation } from "convex/react";
import { useEffect, useRef } from "react";

import { useAuth } from "@clerk/clerk-expo";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";

/* 🔥 SHOW NOTIFICATION EVEN WHEN APP OPEN */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,

    // ✅ NEW REQUIRED (Expo SDK 50+)
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function PushHandler() {
  const router = useRouter();
  const saveToken = useMutation(api.users.savePushToken);

  const { isLoaded, isSignedIn } = useAuth();

  const savedRef = useRef(false); // ✅ prevent duplicate saves

  /* =========================
     🔔 REGISTER TOKEN
  ========================= */
  useEffect(() => {
    if (!isLoaded || !isSignedIn || savedRef.current) return;

    // ❌ skip Expo Go
    if (Constants.appOwnership === "expo") {
      console.log("⚠️ Push disabled in Expo Go");
      return;
    }

    (async () => {
      try {
        const token = await registerForPushNotificationsAsync();

        if (token) {
          await saveToken({ token });
          savedRef.current = true; // ✅ only once
        }
      } catch (e) {
        console.log("Push setup error:", e);
      }
    })();
  }, [isLoaded, isSignedIn]);

  /* =========================
     📲 HANDLE CLICK
  ========================= */
  useEffect(() => {
    const sub =
      Notifications.addNotificationResponseReceivedListener(
        (response) => {
          const data =
            response.notification.request.content.data as any;

          // ✅ safer check
          if (data?.userId) {
            router.push({
              pathname: "/chat/[id]",
              params: { id: data.userId.toString() },
            });
          }
        }
      );

    return () => sub.remove();
  }, []);

  return null;
}