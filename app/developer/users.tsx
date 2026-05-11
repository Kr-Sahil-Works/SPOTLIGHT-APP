import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import {
  useMutation,
  useQuery,
} from "convex/react";

import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import {
  Image,
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

  const [showDeleteModal,
    setShowDeleteModal] =
    useState(false);

  const [selectedUser,
    setSelectedUser] =
    useState<any>(null);

  const [deleting,
    setDeleting] =
    useState(false);

    const [showDeniedToast,
  setShowDeniedToast] =
  useState(false);
  
  
  const currentUser =
    useQuery(
      api.users.index
        .getCurrentUser
    );

const isAdmin =
  currentUser?.email ===
  "sahillearn44@gmail.com";

const users =
  useQuery(
    api.admin.admin
      .getAllUsers,

    currentUser === undefined
      ? "skip"
      : isAdmin
      ? {}
      : "skip"
  ) ?? [];



  const deleteUser =
    useMutation(
      api.admin.admin
        .deleteUserByAdmin
    );

useEffect(() => {
  if (
    currentUser === undefined
  ) {
    return;
  }

  if (
    !currentUser ||
    currentUser.email !==
      process.env.EXPO_PUBLIC_ADMIN_EMAIL
  ) {
    setShowDeniedToast(
      true
    );

    setTimeout(() => {
      router.replace("/");
    }, 5000);

    setTimeout(() => {
      setShowDeniedToast(
        false
      );
    }, 5000);
  }
}, [currentUser]);



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
  users.filter(
    (u) =>
      u.email !==
        "sahillearn44@gmail.com" &&
      u.username
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
  );

  {showDeniedToast && (
  <View
    style={{
      position: "absolute",
      top: 70,
      alignSelf: "center",

      backgroundColor:
        "#ff2222",

      paddingHorizontal: 18,
      paddingVertical: 14,

      borderRadius: 18,

      zIndex: 9999,

      shadowColor: "#ff0000",
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 10,
    }}
  >
    <Text
      style={{
        color: "#fff",
        fontWeight: "800",
        fontSize: 14,
      }}
    >
      Access denied • Admin only
    </Text>
  </View>
)}

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
          <TouchableOpacity
            key={item._id}
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
            {/* IMAGE */}
            <Image
              source={{
                uri:
  item.image ||
  "https://placehold.co/200",
              }}
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

            {/* DELETE */}
            <TouchableOpacity
  onPress={(e) => {
  e.stopPropagation();

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
          </TouchableOpacity>
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
            onPress={
              confirmDelete
            }
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
    </View>
  );
}