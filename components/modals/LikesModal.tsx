import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function LikesModal({
  visible,
  onClose,
  postId,
}: {
  visible: boolean;
  onClose: () => void;
  postId: Id<"posts"> | null;
}) {
  const router =
    useRouter();

const likes =
  useQuery(
    api.posts.index.getPostLikes,
    postId
      ? { postId }
      : "skip"
  ) || [];

  if (!visible)
    return null;

  return (
    <Modal
      transparent
      animationType="fade"
    >
      {/* BACKDROP */}
      <TouchableWithoutFeedback
        onPress={onClose}
      >
        <View
          style={{
            flex: 1,
            backgroundColor:
              "rgba(0,0,0,0.5)",
          }}
        />
      </TouchableWithoutFeedback>

      {/* SHEET */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "75%",
          backgroundColor:
            "#0a0a0a",

          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
        }}
      >
        {/* HEADER */}
        <View
          style={{
            flexDirection:
              "row",

            justifyContent:
              "center",

            alignItems:
              "center",

            paddingVertical:
              10,
          }}
        >
     <Text
  style={{
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  }}
>
  {likes.length} Likes
</Text>

          <TouchableOpacity
            onPress={onClose}
            style={{
              position:
                "absolute",
              right: 14,
            }}
          >
            <Ionicons
              name="remove"
              size={26}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* LIST */}
       <FlatList
  data={
    likes.filter(
      Boolean
    ) as any[]
  }
  keyExtractor={(
    item
  ) =>
    item._id.toString()
  }
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={{
            paddingBottom:
              30,
          }}
          ListEmptyComponent={
            <View
              style={{
                marginTop:
                  80,
                alignItems:
                  "center",
              }}
            >
              <Ionicons
                name="heart-outline"
                size={42}
                color="#666"
              />

              <Text
                style={{
                  color:
                    "#888",
                  marginTop:
                    10,
                }}
              >
                No likes yet
              </Text>
            </View>
          }
        renderItem={({
  item,
}) => {
  if (!item)
    return null;

  return (
            <TouchableOpacity
              activeOpacity={
                0.8
              }
              onPress={() => {
                onClose();

                router.push(
                  {
                    pathname:
                      "/user/[id]",

                    params: {
                      id:
                        item._id,
                    },
                  }
                );
              }}
              style={{
                flexDirection:
                  "row",

                alignItems:
                  "center",

                paddingHorizontal:
                  16,

                paddingVertical:
                  12,
              }}
            >
              <Image
                source={
                  item.image?.trim()
                    ? {
                        uri:
                          item.image,
                      }
                    : require("@/assets/images/icons/iconbg.webp")
                }
                style={{
                  width: 48,
                  height: 48,
                  borderRadius:
                    24,
                }}
                contentFit="cover"
                cachePolicy="memory-disk"
              />

              <View
                style={{
                  flex: 1,
                  marginLeft:
                    12,
                }}
              >
                <Text
                  style={{
                    color:
                      "#fff",
                    fontWeight:
                      "700",
                    fontSize:
                      14,
                  }}
                >
                  {
                    item.username
                  }
                </Text>

                <Text
                  style={{
                    color:
                      "#9a9a9a",
                    fontSize:
                      13,
                    marginTop:
                      2,
                  }}
                >
                  {
                    item.fullname
                  }
                </Text>

                {item.likedAt && (
                  <Text
                    style={{
                      color:
                        "#666",
                      fontSize:
                        12,
                      marginTop:
                        3,
                    }}
                  >
                    liked{" "}
                    {formatDistanceToNow(
                      item.likedAt,
                      {
                        addSuffix:
                          true,
                      }
                    )}
                  </Text>
                )}
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color="#666"
              />
            </TouchableOpacity>
          )}}
        />
      </View>
    </Modal>
  );
}