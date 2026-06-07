import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) return null;

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } =
      await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return null;

const token = (
  await Notifications.getExpoPushTokenAsync({
    projectId:
      "59f5a6cf-10ee-4edf-bc4c-346d00c2ef9c",
  })
).data;
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
  name: "Messages",

  importance:
    Notifications.AndroidImportance.MAX,

  vibrationPattern: [
    0,
    250,
    250,
    250,
  ],

  lockscreenVisibility:
    Notifications.AndroidNotificationVisibility.PUBLIC,

  enableVibrate: true,

  showBadge: true,
});
  }

  return token;
}