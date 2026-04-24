import { BlurView } from "expo-blur";
import {
  Animated,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* 🔥 EDIT MODAL */
export function EditModal({
  visible,
  scaleAnim,
  editText,
  setEditText,
  selectedMsg,
  setSelectedMsg,
  setEditModal,
  editMessage,
}: any) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <BlurView intensity={80} style={{ flex: 1, justifyContent: "center" }}>
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            margin: 30,
            backgroundColor: "#111",
            borderRadius: 16,
            padding: 16,
          }}
        >
          {/* MINUS */}
          <View style={{ alignItems: "flex-end" }}>
            <TouchableOpacity
              onPress={() => setEditModal(false)}
              style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: "#555",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <View style={{ width: 8, height: 2, backgroundColor: "#000" }} />
            </TouchableOpacity>
          </View>

          <TextInput
            value={editText}
            onChangeText={setEditText}
            style={{
              backgroundColor: "#222",
              color: "#fff",
              padding: 10,
              borderRadius: 10,
            }}
          />

          <TouchableOpacity
            onPress={async () => {
              if (!selectedMsg?._id) return;

              await editMessage({
                messageId: selectedMsg._id,
                newText: editText,
              });

              setEditModal(false);
              setSelectedMsg(null);
            }}
          >
            <Text style={{ color: "#4ade80", padding: 12 }}>Save</Text>
          </TouchableOpacity>
        </Animated.View>
      </BlurView>
    </Modal>
  );
}

/* 🔥 DELETE MODAL */
export function DeleteModal({
  visible,
  selectedMsg,
  deleteMessage,
  setSelectedMsg,
  setDeleteConfirm,
  setLastDeleted,
}: any) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <BlurView intensity={80} style={{ flex: 1, justifyContent: "center" }}>
        <View
          style={{
            margin: 40,
            backgroundColor: "#111",
            borderRadius: 16,
            padding: 16,
          }}
        >
          <Text style={{ color: "#fff", marginBottom: 10 }}>
            Delete this message?
          </Text>

          <TouchableOpacity
            onPress={async () => {
              if (!selectedMsg?._id) return;

              setLastDeleted(selectedMsg);

              setTimeout(() => {
                setLastDeleted(null);
              }, 8000);

            await deleteMessage(selectedMsg);

              setDeleteConfirm(false);
              setSelectedMsg(null);
            }}
          >
            <Text style={{ color: "red", padding: 10 }}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setDeleteConfirm(false)}>
            <Text style={{ color: "#aaa", padding: 10 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
}

/* 🔥 INFO MODAL */
export function InfoModal({
  visible,
  selectedMsg,
  setInfoModal,
}: any) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <BlurView intensity={80} style={{ flex: 1, justifyContent: "center" }}>
        <View
          style={{
            margin: 40,
            backgroundColor: "#111",
            borderRadius: 16,
            padding: 16,
          }}
        >
          <Text style={{ color: "#fff" }}>
            Sent: {new Date(selectedMsg?.createdAt).toLocaleString()}
          </Text>

          <Text style={{ color: "#aaa", marginTop: 6 }}>
            Seen: {selectedMsg?.seen ? "Seen" : "Delivered"}
          </Text>

          {selectedMsg?.edited && (
            <Text style={{ color: "#aaa", marginTop: 6 }}>
              Edited
            </Text>
          )}

          {selectedMsg?.reactions?.length > 0 && (
            <Text style={{ color: "#aaa", marginTop: 10 }}>
              Reactions: {selectedMsg.reactions.join(" ")}
            </Text>
          )}

          <TouchableOpacity onPress={() => setInfoModal(false)}>
            <Text style={{ color: "#4ade80", marginTop: 10 }}>Close</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
}

/* 🔥 MENU MODAL */
export function MenuModal({
  selectedMsg,
  reactionMsg,
  scaleAnim,
  setSelectedMsg,
  setEditText,
  setEditModal,
  setDeleteConfirm,
  setInfoModal,
  currentUserId,
}: any) {
  return (
    <Modal
      transparent
      visible={!!selectedMsg && !reactionMsg}
      animationType="fade"
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
        onPress={() => setSelectedMsg(null)}
      >
        <BlurView intensity={60} style={{ flex: 1, justifyContent: "center" }}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Animated.View
              style={{
                transform: [{ scale: scaleAnim }],
                margin: 40,
                backgroundColor: "#111",
                borderRadius: 16,
                padding: 16,
              }}
            >
              {/* MINUS */}
              <View style={{ alignItems: "flex-end" }}>
                <TouchableOpacity
                  onPress={() => setSelectedMsg(null)}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: "#555",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <View style={{ width: 8, height: 2, backgroundColor: "#000" }} />
                </TouchableOpacity>
              </View>

              {/* EDIT + DELETE (10 MIN RULE) */}
              {selectedMsg &&
                selectedMsg.senderId === currentUserId &&
                Date.now() - selectedMsg.createdAt < 10 * 60 * 1000 && (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                       setEditText(selectedMsg?.text || "");
setEditModal(true);
                      }}
                    >
                      <Text style={{ color: "#fff", padding: 10 }}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        const msg = selectedMsg;
                        setDeleteConfirm(true);
                      }}
                    >
                      <Text style={{ color: "red", padding: 10 }}>Delete</Text>
                    </TouchableOpacity>
                  </>
                )}

              {/* INFO */}
              <TouchableOpacity onPress={() => setInfoModal(true)}>
                <Text style={{ color: "#aaa", padding: 10 }}>Info</Text>
              </TouchableOpacity>
            </Animated.View>
          </Pressable>
        </BlurView>
      </Pressable>
    </Modal>
  );
}

export default function Modals() {
  return null;
}