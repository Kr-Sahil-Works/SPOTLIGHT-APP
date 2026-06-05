import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import {
  useMutation,
  useQuery,
} from "convex/react";

import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";

import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function UsersPage() {
  const router = useRouter();

  const [search, setSearch] =
    useState("");

const [showCodeModal,
  setShowCodeModal] =
  useState(false);

const [accessCode,
  setAccessCode] =
  useState("");

const ACCESS_CODE =
  "SPOTLIGHT007";

  const [showDeleteModal,
    setShowDeleteModal] =
    useState(false);

  const [selectedUser,
    setSelectedUser] =
    useState<any>(null);

  const [deleting,
    setDeleting] =
    useState(false);

  const users =
  useQuery(
    api.admin.admin.getAllUsers
  ) ?? [];

  const deleteUser =
    useMutation(
      api.admin.admin
        .deleteUserByAdmin
    );


  const confirmDelete =
    async () => {
      if (
        deleting ||
        !selectedUser
      ) {
        return;
      }

      try {
        setDeleting(true);

        await deleteUser({
          userId:
            selectedUser._id,
        });

        setShowDeleteModal(
          false
        );

        setSelectedUser(
          null
        );
      } catch {
      } finally {
        setDeleting(false);
      }
    };



const filteredUsers =
  users.filter((u) =>
    (
      u.username || ""
    )
      .toLowerCase()
      .includes(
        search.toLowerCase()
      ) ||
    (
      u.fullname || ""
    )
      .toLowerCase()
      .includes(
        search.toLowerCase()
      )
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
      }}
    >
      {/* HEADER */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",

          paddingHorizontal: 16,

          paddingTop: 10,

          paddingBottom: 20,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            router.back()
          }
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#00ff88"
          />
        </TouchableOpacity>

        <View
          style={{
            marginLeft: 16,
          }}
        >
          <Text
            style={{
              color: "#666",
              fontSize: 12,
            }}
          >
            Admin Control
          </Text>

          <Text
            style={{
              color: "#00ff88",
              fontSize: 24,
              fontWeight: "800",
            }}
          >
            Users
          </Text>
        </View>
      </View>

      {/* SEARCH */}
      <View
        style={{
          paddingHorizontal: 16,
        }}
      >
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search users..."
          placeholderTextColor="#666"
          style={{
            height: 54,

            backgroundColor:
              "rgba(255,255,255,0.04)",

            borderRadius: 18,

            paddingHorizontal: 18,

            color: "#fff",

            borderWidth: 1,

            borderColor:
              "rgba(255,255,255,0.05)",
          }}
        />

        <Text
          style={{
            color: "#666",
            marginTop: 12,
          }}
        >
          Total Users:{" "}
          {filteredUsers.length}
        </Text>
      </View>

      {/* USERS */}
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 120,
        }}
      >
        {filteredUsers.map((item) => (
       <View
  key={item._id}
  style={{
    flexDirection: "row",

    alignItems: "center",

    backgroundColor:
      "rgba(255,255,255,0.03)",

    borderRadius: 20,

    padding: 14,

    marginBottom: 12,

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.05)",
  }}
>
  {/* CLICKABLE USER AREA */}
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={() =>
      router.push({
        pathname:
          "/developer/[id]",

        params: {
          id: item._id,
        },
      })
    }
    style={{
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    }}
  >

            <TouchableOpacity
  activeOpacity={0.9}
  onPress={() =>
    router.push({
      pathname:
        "/developer/[id]",

      params: {
        id: item._id,
      },
    })
  }
  style={{
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  }}
>
            {/* IMAGE */}
      <Image
  source={
    item.image?.trim()
      ? { uri: item.image }
      : require("@/assets/images/icons/iconbg.webp")
  }
  cachePolicy="memory-disk"
  transition={120}
  style={{
    width: 58,
    height: 58,
    borderRadius: 29,
  }}
/>

            {/* INFO */}
            <View
              style={{
                marginLeft: 14,
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: "#fff",

                  fontWeight: "800",

                  fontSize: 15,
                }}
              >
                @{item.username}
              </Text>

              <Text
                style={{
                  color: "#888",

                  marginTop: 4,
                }}
              >
                {item.fullname}
              </Text>
            </View>
</TouchableOpacity>
</TouchableOpacity>

            {/* DELETE */}
            <TouchableOpacity
onPress={() => {
  setSelectedUser(item);

  setShowDeleteModal(true);
}}
            >
              <Ionicons
                name="trash-outline"
                size={20}
                color="#ff4444"
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      {/* DELETE MODAL */}
{showDeleteModal &&
  selectedUser && (
    <View
      style={{
        position: "absolute",

        width: "100%",
        height: "100%",

        backgroundColor:
          "rgba(0,0,0,0.82)",

        justifyContent: "center",

        alignItems: "center",

        zIndex: 999,
      }}
    >
      <View
        style={{
          width: "84%",

          backgroundColor:
            "#111",

          borderRadius: 28,

          padding: 22,

          borderWidth: 1,

          borderColor:
            "rgba(255,255,255,0.05)",
        }}
      >
        {/* ICON */}
        <View
          style={{
            width: 70,
            height: 70,

            borderRadius: 35,

            backgroundColor:
              "rgba(255,70,70,0.12)",

            justifyContent:
              "center",

            alignItems:
              "center",

            alignSelf: "center",
          }}
        >
          <Ionicons
            name="trash-outline"
            size={32}
            color="#ff4444"
          />
        </View>

        {/* TITLE */}
        <Text
          style={{
            color: "#fff",

            fontSize: 22,

            fontWeight: "800",

            textAlign: "center",

            marginTop: 18,
          }}
        >
          Delete User?
        </Text>

        {/* TEXT */}
        <Text
          style={{
            color: "#888",

            textAlign: "center",

            lineHeight: 22,

            marginTop: 12,
          }}
        >
          Permanently remove
          {"\n"}
          @{selectedUser.username}
        </Text>

        {/* BUTTONS */}
        <View
          style={{
            flexDirection: "row",

            gap: 12,

            marginTop: 24,
          }}
        >
          {/* CANCEL */}
          <TouchableOpacity
            onPress={() => {
              setShowDeleteModal(
                false
              );

              setSelectedUser(
                null
              );
            }}
            style={{
              flex: 1,

              height: 52,

              borderRadius: 16,

              backgroundColor:
                "rgba(255,255,255,0.06)",

              justifyContent:
                "center",

              alignItems:
                "center",
            }}
          >
            <Text
              style={{
                color: "#fff",

                fontWeight: "700",
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>

          {/* DELETE */}
          <TouchableOpacity
       onPress={() => {
  setShowDeleteModal(
    false
  );

  setShowCodeModal(
    true
  );
}}
            style={{
              flex: 1,

              height: 52,

              borderRadius: 16,

              backgroundColor:
                "#ff4444",

              justifyContent:
                "center",

              alignItems:
                "center",
            }}
          >
            <Text
              style={{
                color: "#fff",

                fontWeight: "800",
              }}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
)}

{/* ACCESS CODE MODAL */}
<Modal
  visible={showCodeModal}
  transparent
  animationType="fade"
>
  <View
    style={{
      flex: 1,
      backgroundColor:
        "rgba(0,0,0,0.82)",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    }}
  >
    <View
      style={{
        width: "100%",
        backgroundColor:
          "rgba(18,18,18,0.96)",
        borderRadius: 30,
        padding: 22,
        borderWidth: 1,
        borderColor:
          "rgba(255,0,0,0.18)",
      }}
    >
      <Text
        style={{
          color: "#ff3b30",
          fontSize: 22,
          fontWeight: "800",
        }}
      >
        Access Code
      </Text>

      <Text
        style={{
          color: "#888",
          marginTop: 8,
          lineHeight: 22,
        }}
      >
        Enter developer access
        code to permanently
        delete this account.
      </Text>

      <TextInput
        value={accessCode}
        onChangeText={
          setAccessCode
        }
        secureTextEntry
        placeholder="Access code"
        placeholderTextColor="#555"
        style={{
          height: 56,
          borderRadius: 18,
          backgroundColor:
            "#0d0d0d",
          marginTop: 18,
          paddingHorizontal: 16,
          color: "#fff",
          borderWidth: 1,
          borderColor:
            "rgba(255,255,255,0.05)",
        }}
      />

      <View
        style={{
          flexDirection: "row",
          marginTop: 20,
          gap: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setShowCodeModal(
              false
            );

            setAccessCode("");
          }}
          style={{
            flex: 1,
            height: 52,
            borderRadius: 16,
            backgroundColor:
              "#151515",
            justifyContent:
              "center",
            alignItems:
              "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "700",
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            if (
              accessCode !==
              ACCESS_CODE
            ) {
              return;
            }

            await confirmDelete();

            setShowCodeModal(
              false
            );

            setAccessCode("");
          }}
          style={{
            flex: 1,
            height: 52,
            borderRadius: 16,
            backgroundColor:
              "#b30000",
            justifyContent:
              "center",
            alignItems:
              "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "800",
            }}
          >
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
    </View>
  );
}