import { api } from "@/convex/_generated/api";
import { registerForPushNotificationsAsync } from "@/lib/notifications";
import { useMutation } from "convex/react";
import { useEffect, useRef } from "react";

import { useAuth } from "@clerk/clerk-expo";
import Constants from "expo-constants";
import { useRouter } from "expo-router";

export default function PushHandler() {
  const router = useRouter();
  const saveToken = useMutation(api.users.savePushToken);
  const { isLoaded, isSignedIn } = useAuth();
  const savedRef = useRef(false);

  useEffect(() => {
    // 🚫 STOP EVERYTHING in Expo Go (CRITICAL)
    if (Constants.appOwnership === "expo") {
      console.log("🚫 Push disabled in Expo Go");
      return;
    }

    let sub: any;

    (async () => {
      try {
        // ✅ lazy import (prevents crash)
        const Notifications = await import("expo-notifications");

        // ✅ set handler AFTER import
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
          }),
        });

        // 🚨 wait for auth
        if (!isLoaded || !isSignedIn || savedRef.current) return;

        // 🔔 get token
        const token = await registerForPushNotificationsAsync();

        if (token) {
          await saveToken({ token });
          savedRef.current = true;
        }

        // 📲 handle click
        sub =
          Notifications.addNotificationResponseReceivedListener(
            (response: any) => {
              const data =
                response.notification.request.content.data;

              if (data?.userId) {
                router.push({
                  pathname: "/chat/[id]",
                  params: { id: data.userId.toString() },
                });
              }
            }
          );
      } catch (e) {
        console.log("Push setup error:", e);
      }
    })();

    return () => {
      if (sub) sub.remove();
    };
  }, [isLoaded, isSignedIn]);

  return null;
}