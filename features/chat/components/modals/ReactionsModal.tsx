import { AppImage } from "@/shared/ui/AppImage";
import React from "react";
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;

  reactions: any[];

  currentUserId?: string;

  messageId?: any;

  isOnline: boolean;

  toggleReaction?: any;

  onClose: () => void;
};

export default function ReactionsModal({
  visible,
  reactions,
  currentUserId,
  messageId,
  isOnline,
  toggleReaction,
  onClose,
}: Props)  {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor:
            "rgba(0,0,0,0.6)",
        }}
      >
        <View
          style={{
            backgroundColor:
              "#121212",

            borderTopLeftRadius:
              24,

            borderTopRightRadius:
              24,

            minHeight: 350,

            paddingTop: 14,
          }}
        >
          <View
            style={{
              width: 40,

              height: 4,

              borderRadius: 2,

              backgroundColor:
                "#444",

              alignSelf:
                "center",

              marginBottom: 18,
            }}
          />

          <Text
            style={{
              color: "#fff",

              fontSize: 22,

              fontWeight: "700",

              textAlign:
                "center",

              marginBottom: 20,
            }}
          >
            Reactions
          </Text>

          <FlatList
            data={reactions}
            showsVerticalScrollIndicator={false}
showsHorizontalScrollIndicator={false}
            keyExtractor={(
              item,
              index
            ) =>
              `${item.userId}-${index}`
            }
          renderItem={({ item }) => {
const isMine =
  String(item.userId) ===
  String(currentUserId);

  return (
    <TouchableOpacity
      activeOpacity={
        isMine ? 0.7 : 1
      }
   onPress={async () => {
  if (!isMine)
    return;
  if (!isOnline)
    return;
  await toggleReaction?.({
    messageId,
    reaction:
      item.value,
  });

  onClose();
}}
      style={{
        flexDirection: "row",

        justifyContent:
          "space-between",

        alignItems:
          "center",

        paddingHorizontal:
          18,

        paddingVertical:
          14,
      }}
    >
      <View
        style={{
          flexDirection:
            "row",

          alignItems:
            "center",

          flex: 1,
        }}
      >
        <AppImage
          uri={
            item.userImage
          }
          style={{
            width: 44,

            height: 44,

            borderRadius:
              22,

            marginRight: 12,
          }}
        />

        <View>
          <Text
            style={{
              color:
                "#fff",

              fontSize: 16,

              fontWeight:
                "700",
            }}
          >
            {item.fullName ||
              item.userName ||
              "User"}
          </Text>

          {isMine &&
 isOnline && (
            <Text
              style={{
                color:
                  "#8b8b8b",

                fontSize: 12,

                marginTop:
                  2,
              }}
            >
              Tap to remove
            </Text>
          )}
        </View>
      </View>

      <Text
        style={{
          fontSize: 28,
        }}
      >
        {item.value}
      </Text>
    </TouchableOpacity>
  );
}}
          />

          <TouchableOpacity
            onPress={onClose}
            style={{
              padding: 18,
            }}
          >
            <Text
              style={{
                color:
                  "#00ff88",

                textAlign:
                  "center",

                fontWeight:
                  "700",
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}