import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Pressable,
  Text,
  TouchableOpacity
} from "react-native";
import ReactionBar from "./ReactionBar";

export default function MenuModal({
  selectedMsg,
  setReactionMsg,
  setSelectedMsg,
  reactionMsg,
  setReplyMsg,
  setDeleteConfirm,
  currentUserId,
  toggleReaction,
}: any) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  // ✅ OPEN / CLOSE ANIMATION
  useEffect(() => {
    if (selectedMsg) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedMsg]);

  const closeAll = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      setSelectedMsg(null);
      setReactionMsg(null);
    });
  };

  return (
    <Modal transparent visible={!!selectedMsg} animationType="none">
      {/* BACKDROP */}
      <Pressable
        style={{ flex: 1, backgroundColor: "#0000006e" }}
        onPress={closeAll}
      >
        <BlurView intensity={0} style={{ flex: 1 }}>
          
          {/* ✅ REACTION BAR */}
    {reactionMsg && !selectedMsg && (
           <ReactionBar
              reactionMsg={reactionMsg}
              setReactionMsg={setReactionMsg}
            toggleReaction={toggleReaction}
            />
          )}

          {/* MENU */}
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Animated.View
              style={{
                width: "60%",
                marginTop: 120,
                backgroundColor: "#1c1c1e",
                borderRadius: 20,
                paddingVertical: 10,
                paddingHorizontal: 20,
                alignSelf: "center",

                // ✅ animation
                opacity,
                transform: [{ scale }],
              }}
            >
              <Action
                icon="arrow-undo"
                text="Reply"
                onPress={() => {
                  setReplyMsg(selectedMsg);
                  closeAll();
                }}
              />

              <Action
                icon="copy-outline"
                text="Copy"
                onPress={() => {
                  closeAll();
                }}
              />

              {selectedMsg?.senderId === currentUserId && (
                <>
                  <Action
                    icon="create-outline"
                    text="Edit"
                    onPress={closeAll}
                  />

                  <Action
                    icon="trash-outline"
                    text="Delete"
                    danger
                    onPress={() => {
                      setDeleteConfirm(true);
                      closeAll();
                    }}
                  />
                </>
              )}

              <Action
                icon="bookmark-outline"
                text="Pin"
                onPress={closeAll}
              />

              <Action
                icon="flag-outline"
                text="Report"
                danger
                onPress={closeAll}
              />
            </Animated.View>
          </Pressable>
        </BlurView>
      </Pressable>
    </Modal>
  );
}

/* ACTION */
function Action({ icon, text, onPress, danger }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
      }}
    >
      <Ionicons
        name={icon}
        size={20}
        color={danger ? "red" : "#fff"}
        style={{ width: 26 }}
      />
      <Text
        style={{
          color: danger ? "red" : "#fff",
          fontSize: 16,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}