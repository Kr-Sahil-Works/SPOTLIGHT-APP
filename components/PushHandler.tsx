import { api } from "@/convex/_generated/api";
import { registerForPushNotificationsAsync } from "@/lib/notifications";

import { useMutation } from "convex/react";

import { useEffect, useRef } from "react";

import { useAuth } from "@clerk/clerk-expo";

import Constants from "expo-constants";

import { useRouter } from "expo-router";

export default function PushHandler() {
  const router = useRouter();

  const saveToken =
    useMutation(
      api.users.index
        .savePushToken
    );

    const markSeen =
  useMutation(
    api.messages.index
      .markAsSeen
  );

  const {
    isLoaded,
    isSignedIn,
  } = useAuth();

  const savedRef =
    useRef(false);

  const isExpoGo =
    Constants.appOwnership ===
    "expo";

  useEffect(() => {
    if (isExpoGo) {
      console.log(
        "🚫 Push disabled in Expo Go"
      );

      return;
    }

    let sub: any;

    (async () => {
      try {
        const Notifications =
          await import(
            "expo-notifications"
          );
          await Notifications.setNotificationCategoryAsync(
  "message",
[
  {
    identifier: "reply",
    buttonTitle: "Reply",
  },
  {
    identifier: "open",
    buttonTitle: "Open Chat",
  },
]
);

        Notifications
          .setNotificationHandler(
            {
              handleNotification:
                async (
                  notification
                ) => {
                  const data =
                    notification
                      .request
                      .content.data;

                  const senderId =
                    data?.userId;

                  const currentChatId =
                   (global as any).currentChatId;

                  const insideSameChat =
                    currentChatId ===
                    senderId;

               return {
  shouldPlaySound:
    !insideSameChat,

  shouldSetBadge:
    false,

  shouldShowBanner:
    !insideSameChat,

  shouldShowList:
    !insideSameChat,
};
                },
            }
          );

        if (
          !isLoaded ||
          !isSignedIn ||
          savedRef.current
        ) {
          return;
        }

        const token =
          await registerForPushNotificationsAsync();
        if (token) {
          await saveToken({
            token,
          });

          savedRef.current =
            true;
        }

        sub =
          Notifications.addNotificationResponseReceivedListener(
            (
              response: any
            ) => {
              const actionId =
  response.actionIdentifier;

              const data =
                response
                  .notification
                  .request
                  .content.data;

                  if (
  data?.type === "follow" &&
  data?.userId
) {
  router.push({
    pathname:
      "/user/[id]",

    params: {
      id:
        data.userId.toString(),
    },
  });

  return;
}

if (
  data?.type === "comment" &&
  data?.postId
) {
  router.push({
    pathname:
      "/post/[id]",

    params: {
      id:
        data.postId.toString(),

      openComments:
        "true",
    },
  });

  return;
}

if (
  data?.type === "like" &&
  data?.postId
) {
  router.push({
    pathname:
      "/post/[id]",

    params: {
      id:
        data.postId.toString(),
    },
  });

  return;
}

                  if (
  actionId === "reply" &&
  data?.userId
) {
  router.push({
    pathname:
      "/chat/[id]",

    params: {
      id:
        data.userId.toString(),

      focusInput:
        "true",
    },
  });

  return;
}
                  

if (
  isLoaded &&
  isSignedIn &&
  data?.userId
) {
  markSeen({
    userId:
      data.userId,
  }).catch(() => {});

  router.push({
                  pathname:
                    "/chat/[id]",

                  params: {
                    id: data.userId.toString(),
                  },
                });
              }
            }
          );
      } catch (e) {
        console.log(
          "Push setup error:",
          e
        );
      }
    })();

    return () => {
      if (sub) {
        sub.remove();
      }
    };
  }, [isLoaded, isSignedIn]);

  return null;
}