import { Ionicons } from "@expo/vector-icons";
import {
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Collection = {
  _id: string;
  name: string;
};

type CollectionModalProps = {
  visible: boolean;
  collections: Collection[];
  isOnline: boolean;
  name: string;
  setName: (value: string) => void;
  onClose: () => void;
  onCreate: () => void;
  onSelect: (id: string) => void;
};

export default function CollectionModal({
  visible,
  collections,
  isOnline,
  name,
  setName,
  onClose,
  onCreate,
  onSelect,
}: CollectionModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
      >
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            <Text style={styles.title}>
              Save To Collection
            </Text>

            <View style={styles.createRow}>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="New collection..."
                placeholderTextColor="#666"
                underlineColorAndroid="transparent"
                style={styles.input}
              />

              <TouchableOpacity
                disabled={!isOnline || !name.trim()}
                onPress={onCreate}
                style={[
                  styles.createButton,
                  {
                    opacity:
                      isOnline && name.trim() ? 1 : 0.4,
                  },
                ]}
              >
                {name.trim() ? (
                  <Text style={styles.createText}>
                    Create
                  </Text>
                ) : (
                  <Ionicons
                    name="add"
                    size={22}
                    color="#9dd6b2"
                  />
                )}
              </TouchableOpacity>
            </View>

            <FlatList
              data={collections}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              style={styles.list}
              renderItem={({ item }) => (
                <TouchableOpacity
                  disabled={!isOnline}
                  onPress={() => onSelect(item._id)}
                  style={[
                    styles.collection,
                    {
                      opacity: isOnline ? 1 : 0.4,
                    },
                  ]}
                >
                  <Ionicons
                    name="folder-outline"
                    size={22}
                    color="#22c55e"
                  />

                  <Text style={styles.collectionName}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.empty}>
                  No collections yet
                </Text>
              }
            />

            <TouchableOpacity
              onPress={onClose}
              style={styles.close}
            >
              <Text style={styles.closeText}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.65)",
  },

  sheet: {
    backgroundColor: "#111",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: "80%",
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
  },

  createRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    height: 50,
    backgroundColor: "#161616",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.15)",
    borderRadius: 16,
    paddingHorizontal: 16,
    color: "#fff",
  },

  createButton: {
    minWidth: 54,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#166534",
    justifyContent: "center",
    alignItems: "center",
  },

  createText: {
    color: "#bcdcc8",
    fontWeight: "800",
    fontSize: 14,
  },

  list: {
    maxHeight: 180,
  },

  collection: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },

  collectionName: {
    color: "#fff",
    marginLeft: 14,
    fontSize: 16,
    fontWeight: "600",
  },

  empty: {
    color: "#666",
    textAlign: "center",
    paddingVertical: 20,
  },

  close: {
    marginTop: 20,
    alignSelf: "center",
  },

  closeText: {
    color: "#888",
    fontSize: 15,
  },
});