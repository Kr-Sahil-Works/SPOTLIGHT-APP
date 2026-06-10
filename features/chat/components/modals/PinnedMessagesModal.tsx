import {
    Ionicons,
} from "@expo/vector-icons";

import React from "react";

import {
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function PinnedMessagesModal({
  visible,

  onClose,

  pinnedMessages,

  onCopy,

  onUnpin,

  onRepin,
}: any) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >
      <View
        style={{
          flex: 1,

          backgroundColor:
            "rgba(0,0,0,0.45)",

          justifyContent:
            "flex-start",
        }}
      >
        <View
          style={{
            backgroundColor:
              "#111",

            paddingTop: 60,

            borderBottomLeftRadius: 28,

            borderBottomRightRadius: 28,

            paddingBottom: 20,
          }}
        >
          <ScrollView>
            {pinnedMessages.map(
              (msg: any) => (
                <View
                  key={
                    msg._id
                  }
                  style={{
                    paddingHorizontal: 18,

                    paddingVertical: 14,

                    borderBottomWidth: 1,

                    borderBottomColor:
                      "#ffffff08",
                  }}
                >
                  <Text
                    style={{
                      color:
                        "#fff",

                      fontSize: 14,
                    }}
                  >
                    {msg.text}
                  </Text>

                  <View
                    style={{
                      flexDirection:
                        "row",

                      marginTop: 12,

                      gap: 18,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        onCopy(
                          msg
                        )
                      }
                    >
                      <Ionicons
                        name="copy-outline"
                        size={20}
                        color="#fff"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        onRepin(
                          msg
                        )
                      }
                    >
                      <Ionicons
                        name="refresh"
                        size={20}
                        color="#00b7ff"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        onUnpin(
                          msg
                        )
                      }
                    >
                      <Ionicons
                        name="pin-outline"
                        size={20}
                        color="#ff4444"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )
            )}
          </ScrollView>

          <TouchableOpacity
            onPress={onClose}
            style={{
              alignSelf:
                "center",

              marginTop: 18,
            }}
          >
            <Ionicons
              name="close"
              size={28}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}