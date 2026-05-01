// import { api } from "@/convex/_generated/api";
// import { Ionicons } from "@expo/vector-icons";
// import { useQuery } from "convex/react";
// import { useRouter } from "expo-router";
// import { useState } from "react";
// import {
//   FlatList,
//   Image,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// export default function Chats() {
//   const router = useRouter();
//   const [search, setSearch] = useState("");

//   const chats = useQuery(api.messages.getChatList);
//   const searchUsers = useQuery(api.users.searchUsers, {
//     search: search || "",
//   });
//   const allUsers = useQuery(api.users.getAllUsers);

//   const dataSource =
//     search.trim().length > 0
//       ? searchUsers || []
//       : chats && chats.length > 0
//       ? chats
//       : allUsers || [];

//   return (
//     <View
//       style={{
//         flex: 1,
//         backgroundColor: "#050505",
//         paddingTop: 10,
//       }}
//     >
//       {/* 🔥 HEADER */}
//       <View
//         style={{
//           paddingHorizontal: 16,
//           paddingBottom: 10,
//           flexDirection: "row",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <Text
//           style={{
//             color: "#22c55e",
//             fontSize: 22,
//             fontWeight: "700",
//             letterSpacing: 0.5,
//           }}
//         >
//           Chats
//         </Text>

//         {/* ACTION BUTTONS */}
//         <View style={{ flexDirection: "row", gap: 12 }}>
//           {/* NOTES */}
//           <TouchableOpacity
//             activeOpacity={0.7}
//             onPress={() => router.replace("/chat/notes")}
//             style={{
//               backgroundColor: "rgba(255,255,255,0.05)",
//               padding: 10,
//               borderRadius: 14,
//               borderWidth: 1,
//               borderColor: "rgba(255,255,255,0.06)",
//             }}
//           >
//            <Image
//   source={require("@/assets/images/notes.png")}
//   style={{
//     width: 20,
//     height: 20,
//   }}
// />
//           </TouchableOpacity>

//           {/* CALCULATOR */}
//           <TouchableOpacity
//             activeOpacity={0.7}
//             onPress={() => router.replace("/chat/calculator")}
//             style={{
//               backgroundColor: "rgba(255,255,255,0.05)",
//               padding: 10,
//               borderRadius: 14,
//               borderWidth: 1,
//               borderColor: "rgba(255,255,255,0.06)",
//             }}
//           >
//           <Image
//   source={require("@/assets/images/calc.png")}
//   style={{
//     width: 20,
//     height: 20,
//   }}
// />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* 🔥 SEARCH BAR (iOS STYLE) */}
//       <View
//         style={{
//           marginHorizontal: 14,
//           marginBottom: 10,
//           backgroundColor: "rgba(255,255,255,0.06)",
//           borderRadius: 14,
//           flexDirection: "row",
//           alignItems: "center",
//           paddingHorizontal: 12,
//           height: 44,
//           borderWidth: 1,
//           borderColor: "rgba(255,255,255,0.05)",
//         }}
//       >
//         <Ionicons name="search" size={16} color="#999" />
//         <TextInput
//           placeholder="Search chats..."
//           placeholderTextColor="#777"
//           value={search}
//           onChangeText={setSearch}
//           style={{
//             color: "#fff",
//             marginLeft: 8,
//             flex: 1,
//             fontSize: 14,
//           }}
//         />
//       </View>

//       {/* 🔥 CHAT LIST */}
//       <FlatList
//         data={dataSource}
//         initialNumToRender={6}
//         maxToRenderPerBatch={6}
//         windowSize={5}
//         removeClippedSubviews
//         keyExtractor={(item: any) =>
//           String(item.userId ?? item._id)
//         }
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           paddingBottom: 20,
//         }}
//         renderItem={({ item }: any) => {
//           const userId = item.userId ?? item._id;

//           const isOnline = item?.isOnline === true;
//           const showOnline = item?.showOnline !== false;

//           return (
//             <TouchableOpacity
//               activeOpacity={0.8}
//               onPress={() =>
//                 router.push({
//                   pathname: "/chat/[id]",
//                   params: {
//                     id: userId.toString(),
//                     name: item.fullname,
//                     image: item.image,
//                   },
//                 })
//               }
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 paddingVertical: 12,
//                 paddingHorizontal: 14,
//                 marginHorizontal: 10,
//                 marginBottom: 6,
//                 borderRadius: 16,
//                 borderWidth: 1,

//                 backgroundColor: "#0f0f0f",
// borderColor: "rgba(255,255,255,0.08)",
// shadowColor: "#000",
// shadowOpacity: 0.4,
// shadowRadius: 10,
// elevation: 3,
//               }}
//             >
//               {/* 🔥 AVATAR */}
//               <View
//                 style={{
//                   padding: 2,
//                   borderWidth: 2,
//                   borderRadius: 30,
//                   borderColor:
//                     showOnline && isOnline
//                       ? "#22c55e"
//                       : "rgba(255,255,255,0.15)",
//                 }}
//               >
//                 <Image
//                   source={
//                     item?.image && item.image.startsWith("http")
//                       ? { uri: item.image }
//                       : require("@/assets/images/iconbg.png")
//                   }
//                   style={{
//                     width: 54,
//                     height: 54,
//                     borderRadius: 27,
//                     backgroundColor: "#222",
//                   }}
//                 />
//               </View>

//               {/* 🔥 TEXT AREA */}
//               <View style={{ marginLeft: 12, flex: 1 }}>
//                 <Text
//                   style={{
//                     color: "#fff",
//                     fontSize: 15,
//                     fontWeight: "500",
//                   }}
//                 >
//                   {item.fullname ?? ""}
//                 </Text>

//                 {/* OPTIONAL subtitle */}
//               <Text
//   numberOfLines={1}
//   style={{
//     color: item.lastMessage ? "#ccc" : "#777",
//     fontSize: 12,
//     marginTop: 2,
//   }}
// >
//   {item.lastMessage?.text
//     ? item.lastMessage.text
//     : "Tap to chat"}
// </Text>
//               </View>

//               {/* 🔥 RIGHT ICON */}
//               <Ionicons
//                 name="chevron-forward"
//                 size={16}
//                 color="rgba(255,255,255,0.3)"
//               />
//             </TouchableOpacity>
//           );
//         }}
//       />
//     </View>
//   );
// }


// ------------------------------------------------------------------------------------------------------------------------------------------------------------------//



import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function Chats() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const chats = useQuery(api.messages.getChatList);
  const searchUsers = useQuery(api.users.searchUsers, {
    search: search || "",
  });
  const allUsers = useQuery(api.users.getAllUsers);

  const dataSource =
    search.trim().length > 0
      ? searchUsers || []
      : chats && chats.length > 0
      ? chats
      : allUsers || [];

  return (
    <View style={{ flex: 1, backgroundColor: "#030405" }}>
      
      {/* 🔥 HEADER */}
      <View style={{ paddingTop: 20, paddingHorizontal: 18 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          
          <Text
            style={{
              color: "#22c55e",
              fontSize: 30,
              fontWeight: "800",
              letterSpacing: 0.5,
            }}
          >
            Messages
          </Text>

          <View style={{ flexDirection: "row", gap: 14 }}>
            <TouchableOpacity
  onPress={() => router.replace("/chat/notes")}
  style={{
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 10,
    borderRadius: 18,
  }}
>
              <Image source={require("@/assets/images/notes.png")} style={{ width: 22, height: 22 }} />
            </TouchableOpacity>

  <TouchableOpacity
  onPress={() => router.replace("/chat/calculator")}
  style={{
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 10,
    borderRadius: 18,
  }}
>
              <Image source={require("@/assets/images/calc.png")} style={{ width: 22, height: 22 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* SEARCH */}
        <View
          style={{
            marginTop: 16,
            backgroundColor: "#0b0f0c",
            borderRadius: 22,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 14,
            height: 50,
            borderWidth: 1,
            borderColor: "rgba(34,197,94,0.15)",
          }}
        >
          <Ionicons name="search" size={18} color="#22c55e" />
          <TextInput
            placeholder="Search chats"
            placeholderTextColor="#2e4d3a"
            value={search}
            onChangeText={setSearch}
            style={{
              color: "#22c55e",
              marginLeft: 10,
              flex: 1,
              fontSize: 15,
            }}
          />
        </View>
      </View>

      {/* 🔥 CHAT SHEET */}
   <View
  style={{
    flex: 1,
    marginTop: 28,
    marginHorizontal: 6,
    backgroundColor: "#13f08100",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingTop: 10,
  }}
>
        {/* HANDLE */}
        <View
          style={{
            alignSelf: "center",
            width: 50,
            height: 5,
            borderRadius: 10,
            backgroundColor: "#22c55e4d",
            marginBottom: 10,
          }}
        />

        <FlatList
          data={dataSource}
          keyExtractor={(item: any) =>
            String(item.userId ?? item._id)
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 40,
          }}
          renderItem={({ item }: any) => {

            const userId = item.userId ?? item._id;
            const isOnline = item?.isOnline === true;
            const showOnline = item?.showOnline !== false;

            return (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() =>
  router.push({
    pathname: "/chat/[id]",
    params: {
      id: userId.toString(),
      name: item.fullname,
      image: item.image,
    },
  })
}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 14,
                    paddingHorizontal: 10,
                    marginBottom: 6,
                    borderRadius: 18,

                    backgroundColor: "#000604",

                    borderWidth: 1,
                    borderColor: "rgba(34,197,94,0.08)",
                  }}
                >
                  {/* AVATAR */}
                  <View
                    style={{
                      borderWidth: 2,
                      borderRadius: 34,
                      borderColor:
                        showOnline && isOnline
                          ? "#22c55e"
                          : "rgba(255,255,255,0.1)",
                      padding: 2,
                    }}
                  >
                    <Image
                      source={
                        item?.image && item.image.startsWith("http")
                          ? { uri: item.image }
                          : require("@/assets/images/iconbg.png")
                      }
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: "#111",
                      }}
                    />
                  </View>

                  {/* TEXT */}
                  <View style={{ marginLeft: 14, flex: 1 }}>
                    <Text
                      style={{
                        color: "#ffffff",
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                    >
                      {item.fullname ?? ""}
                    </Text>

                    <Text
                      numberOfLines={1}
                      style={{
                        color: item.lastMessage ? "#979797" : "#355f47",
                        fontSize: 13,
                        marginTop: 4,
                      }}
                    >
                      {item.lastMessage?.text || "Tap to chat"}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color="rgba(34,197,94,0.4)"
                  />
                </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
}





// ------------------------------------------------------------------------------------------------------------------------------------------------------------------//





// import { api } from "@/convex/_generated/api";
// import { Ionicons } from "@expo/vector-icons";
// import { useQuery } from "convex/react";
// import { useRouter } from "expo-router";
// import { useState } from "react";
// import {
//   FlatList,
//   Image,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// export default function Chats() {
//   const router = useRouter();
//   const [search, setSearch] = useState("");

//   const chats = useQuery(api.messages.getChatList);
//   const searchUsers = useQuery(api.users.searchUsers, {
//     search: search || "",
//   });
//   const allUsers = useQuery(api.users.getAllUsers);

//   const dataSource =
//     search.trim().length > 0
//       ? searchUsers || []
//       : chats && chats.length > 0
//       ? chats
//       : allUsers || [];

//   return (
//     <View style={{ flex: 1, backgroundColor: "#000" }}>
      
//       {/* 🔥 HEADER GLASS */}
//       <View
//         style={{
//           paddingTop: 20,
//           paddingHorizontal: 16,
//           paddingBottom: 16,
//           backgroundColor: "rgba(10,10,10,0.8)",
//           borderBottomWidth: 1,
//           borderBottomColor: "rgba(255,255,255,0.05)",
//         }}
//       >
//         <View
//           style={{
//             flexDirection: "row",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Text
//             style={{
//               color: "#1dba08",
//               fontSize: 30,
//               fontWeight: "800",
//             }}
//           >
//             Messages
//           </Text>

//           <View style={{ flexDirection: "row", gap: 12 }}>
//             <TouchableOpacity onPress={() => router.replace("/chat/notes")}>
//               <Image source={require("@/assets/images/notes.png")} style={{ width: 22, height: 22 }} />
//             </TouchableOpacity>

//             <TouchableOpacity onPress={() => router.replace("/chat/calculator")}>
//               <Image source={require("@/assets/images/calc.png")} style={{ width: 22, height: 22 }} />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* SEARCH */}
//         <View
//           style={{
//             marginTop: 20,
//             backgroundColor: "#111",
//             borderRadius: 20,
//             flexDirection: "row",
//             alignItems: "center",
//             paddingHorizontal: 14,
//             height: 48,
//           }}
//         >
//           <Ionicons name="search" size={18} color="#666" />
//           <TextInput
//             placeholder="Search chats"
//             placeholderTextColor="#555"
//             value={search}
//             onChangeText={setSearch}
//             style={{
//               color: "#fff",
//               marginLeft: 10,
//               flex: 1,
//               fontSize: 15,
//             }}
//           />
//         </View>
//       </View>

//       {/* 🔥 CHAT LIST (FLOATING CARDS) */}
//       <FlatList
//         data={dataSource}
//         keyExtractor={(item: any) => String(item.userId ?? item._id)}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           marginTop: 20,
//           padding: 14,
//           paddingTop: 10,
//           paddingBottom: 40,
//         }}
//         renderItem={({ item }: any) => {
//           const userId = item.userId ?? item._id;
//           const isOnline = item?.isOnline === true;
//           const showOnline = item?.showOnline !== false;

//           return (
//             <TouchableOpacity
//               activeOpacity={0.9}
//               onPress={() =>
//                 router.push({
//                   pathname: "/chat/[id]",
//                   params: {
//                     id: userId.toString(),
//                     name: item.fullname,
//                     image: item.image,
//                   },
//                 })
//               }
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 padding: 12,
//                 marginBottom: 12,
//                 borderRadius: 24,

//                 backgroundColor: "#0c0c0c",

//                 shadowColor: "#000",
//                 shadowOpacity: 0.9,
//                 shadowRadius: 18,
//                 elevation: 6,
//               }}
//             >
//               {/* AVATAR BIGGER */}
//               <View
//                 style={{
//                   borderWidth: 2,
//                   borderRadius: 34,
//                   borderColor:
//                     showOnline && isOnline
//                       ? "#22c55e"
//                       : "rgba(255,255,255,0.15)",
//                   padding: 2,
//                 }}
//               >
//                 <Image
//                   source={
//                     item?.image && item.image.startsWith("http")
//                       ? { uri: item.image }
//                       : require("@/assets/images/iconbg.png")
//                   }
//                   style={{
//                     width: 50,
//                     height: 50,
//                     borderRadius: 32,
//                     backgroundColor: "#111",
//                   }}
//                 />
//               </View>

//               {/* TEXT */}
//               <View style={{ marginLeft: 16, flex: 1 }}>
//                 <Text
//                   style={{
//                     color: "#fff",
//                     fontSize: 17,
//                     fontWeight: "600",
//                   }}
//                 >
//                   {item.fullname ?? ""}
//                 </Text>

//                 <Text
//                   numberOfLines={1}
//                   style={{
//                     color: item.lastMessage ? "#aaa" : "#555",
//                     fontSize: 13,
//                     marginTop: 4,
//                   }}
//                 >
//                   {item.lastMessage?.text || "Tap to chat"}
//                 </Text>
//               </View>

//               {/* RIGHT */}
//               <Ionicons
//                 name="chevron-forward"
//                 size={20}
//                 color="rgba(255,255,255,0.2)"
//               />
//             </TouchableOpacity>
//           );
//         }}
//       />
//     </View>
//   );
// }
