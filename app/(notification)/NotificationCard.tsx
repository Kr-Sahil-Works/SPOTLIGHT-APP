import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/notifications.styles";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Notification({
  notification,
}: any) {
  const router =
    useRouter();

  const handlePress =
    () => {
      if (
        notification.type ===
        "follow"
      ) {
        router.push({
          pathname:
            "/user/[id]",

          params: {
            id:
              notification
                .sender._id,
          },
        });

        return;
      }

      if (
        notification.postId
      ) {
        router.push({
          pathname:
            "/post/[id]",

          params: {
            id:
              notification.postId,

            openComments:
              notification.type ===
              "comment"
                ? "true"
                : undefined,
          },
        });
      }
    };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={
        handlePress
      }
    >
      <View
        style={
          styles.notificationItem
        }
      >
        <View
          style={
            styles.notificationContent
          }
        >
          <TouchableOpacity
            activeOpacity={
              0.8
            }
            onPress={() =>
              router.push({
                pathname:
                  "/user/[id]",

                params: {
                  id:
                    notification
                      .sender
                      ._id,
                },
              })
            }
            style={
              styles.avatarContainer
            }
          >
            <Image
              source={
                notification
                  .sender
                  .image?.trim()
                  ? {
                      uri:
                        notification
                          .sender
                          .image,
                    }
                  : require("@/assets/images/icons/iconbg.webp")
              }
              style={
                styles.avatar
              }
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={
                100
              }
            />

            <View
              style={
                styles.iconBadge
              }
            >
              {notification.type ===
              "like" ? (
                <Ionicons
                  name="heart"
                  size={12}
                  color={
                    COLORS.primary
                  }
                />
              ) : notification.type ===
                "follow" ? (
                <Ionicons
                  name="person-add"
                  size={12}
                  color="#8B5CF6"
                />
              ) : (
                <Ionicons
                  name="chatbubble"
                  size={12}
                  color="#3B82F6"
                />
              )}
            </View>
          </TouchableOpacity>

          <View
            style={
              styles.notificationInfo
            }
          >
            <TouchableOpacity
              activeOpacity={
                0.7
              }
              onPress={() =>
                router.push({
                  pathname:
                    "/user/[id]",

                  params: {
                    id:
                      notification
                        .sender
                        ._id,
                  },
                })
              }
            >
              <Text
                style={
                  styles.username
                }
              >
                {
                  notification
                    .sender
                    .username
                }
              </Text>
            </TouchableOpacity>

            <Text
              style={
                styles.action
              }
            >
              {notification.type ===
              "follow"
                ? "started following you"
                : notification.type ===
                  "like"
                ? "liked your post"
                : notification.type ===
                  "comment"
                ? notification.comment
                  ? `commented: "${notification.comment}"`
                  : "commented on your post"
                : ""}
            </Text>

            <Text
              style={
                styles.timeAgo
              }
            >
              {formatDistanceToNow(
                notification._creationTime,
                {
                  addSuffix:
                    true,
                }
              )}
            </Text>
          </View>
        </View>

        {notification.type ===
        "follow" ? (
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor:
                "#111",
              alignItems:
                "center",
              justifyContent:
                "center",
            }}
          >
            <Ionicons
              name="people"
              size={24}
              color="#8b5cf6"
            />
          </View>
        ) : notification.post ? (
          <Image
            source={
              notification
                .post
                .imageUrl?.trim()
                ? {
                    uri:
                      notification
                        .post
                        .imageUrl,
                  }
                : require("@/assets/images/icons/iconbg.webp")
            }
            style={
              styles.postImage
            }
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={
              120
            }
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
}