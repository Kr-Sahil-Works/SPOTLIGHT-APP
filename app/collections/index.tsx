import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";


export default function CollectionsPage() {
  const router = useRouter();

  const collections =
    useQuery(api.collections.getCollections) ?? [];
const deleteCollection = useMutation(
  api.collections.deleteCollection
);

const [toast, setToast] = useState({
  visible: false,
  text: "",
});

const showToast = (text: string) => {
  setToast({
    visible: true,
    text,
  });

  setTimeout(() => {
    setToast({
      visible: false,
      text: "",
    });
  }, 2200);
};


const [showDeleteModal, setShowDeleteModal] =
  useState(false);

const [selectedCollectionId, setSelectedCollectionId] =
  useState<any>(null);

const modalScale = useRef(
  new Animated.Value(0.8)
).current;

const modalOpacity = useRef(
  new Animated.Value(0)
).current;


const handleDeleteCollection =
  async () => {
    try {
      await deleteCollection({
        collectionId:
          selectedCollectionId,
      });

      setShowDeleteModal(false);

      showToast(
        "Collection deleted"
      );
    } catch {
      showToast(
        "Delete failed"
      );
    }
  };

    const selectAnim = useRef(
  new Animated.Value(0)
).current;

const folderAnim = useRef(
  new Animated.Value(0)
).current;

const [selectedDemo, setSelectedDemo] =
  useState(false);

const [showDemo, setShowDemo] =
  useState(true);

  const fadeAnim = useRef(
  new Animated.Value(1)
).current;

useEffect(() => {
  let count = 0;

  const runAnimation = () => {
    setSelectedDemo(true);

    Animated.sequence([
      /* SELECT IMAGE */
      Animated.timing(selectAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),

      Animated.delay(700),

      /* FOLDER APPEAR SLOWLY */
      Animated.timing(folderAnim, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true,
      }),

      Animated.delay(1400),

      /* RESET */
      Animated.parallel([
        Animated.timing(selectAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),

        Animated.timing(folderAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setSelectedDemo(false);

      count++;

      /* STOP AFTER 6 TIMES */
      if (count >= 6) {
        Animated.timing(fadeAnim, {
  toValue: 0,
  duration: 1200,
  useNativeDriver: true,
}).start(() => {
  setShowDemo(false);
});
        return;
      }

      setTimeout(runAnimation, 500);
    });
  };

  runAnimation();
}, []);


  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
        padding: 16,
      }}
    >

{/* HEADER */}
<View
  style={{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingTop: 8,
  }}
>
  {/* BACK */}
  <TouchableOpacity
    onPress={() => router.back()}
    style={{
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: "#1111113e",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#000000e5",
    }}
  >
    <Ionicons
      name="arrow-back"
      size={22}
      color="#18b600"
    />
  </TouchableOpacity>

  {/* TITLE */}
  <View
    style={{
      flex: 1,
      alignItems: "center",
    }}
  >
    <Text
      style={{
        color: "#18b600",
        fontSize: 24,
        fontWeight: "800",
        letterSpacing: 0.3,
      }}
    >
      Collections
    </Text>
  </View>

  {/* RIGHT SPACE */}
  <View
    style={{
      width: 42,
    }}
  />
</View>

      {/* EMPTY */}
  {collections.length === 0 ? (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 20,
    }}
  >
    {/* MAIN CARD */}
    <View
      style={{
        backgroundColor: "#111",
        borderRadius: 30,
        padding: 24,
        borderWidth: 1,
        borderColor:
          "rgba(0,255,136,0.12)",
      }}
    >
      {/* ICON */}
      <View
        style={{
          width: 82,
          height: 82,
          borderRadius: 41,
          backgroundColor:
            "rgba(0,255,136,0.08)",
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        <Ionicons
          name="folder-open-outline"
          size={42}
          color="#00ff88"
        />
      </View>

      {/* TITLE */}
      <Text
        style={{
          color: "#fff",
          fontSize: 25,
          fontWeight: "800",
          textAlign: "center",
          marginTop: 20,
        }}
      >
        No Collections Yet
      </Text>

      {/* SUBTEXT */}
      <Text
        style={{
          color: "#888",
          fontSize: 12,
          textAlign: "center",
          marginTop: 10,
          lineHeight: 18,
        }}
      >
   Organize saved posts into collections
      </Text>

      {/* STEP CARD */}
      <View
        style={{
          marginTop: 28,
          backgroundColor: "#181818",
          borderRadius: 22,
          padding: 18,
        }}
      >
        {/* STEP */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor:
                "rgba(0,255,136,0.12)",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <Text
              style={{
                color: "#00ff88",
                fontWeight: "800",
              }}
            >
              1
            </Text>
          </View>

          <Text
            style={{
              color: "#fff",
              fontSize: 15,
              fontWeight: "600",
              flex: 1,
            }}
          >
            Go to your bookmarks page
          </Text>
        </View>

        {/* STEP */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor:
                "rgba(0,255,136,0.12)",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <Text
              style={{
                color: "#00ff88",
                fontWeight: "800",
              }}
            >
              2
            </Text>
          </View>

          <Text
            style={{
              color: "#fff",
              fontSize: 15,
              fontWeight: "600",
              flex: 1,
            }}
          >
            Long press any bookmarked photo
          </Text>
        </View>

        {/* STEP */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor:
                "rgba(0,255,136,0.12)",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <Text
              style={{
                color: "#00ff88",
                fontWeight: "800",
              }}
            >
              3
            </Text>
          </View>

          <Text
            style={{
              color: "#fff",
              fontSize: 15,
              fontWeight: "600",
              flex: 1,
            }}
          >
            Tap "Add To Collection"
          </Text>
        </View>
      </View>


{/* VISUAL DEMO */}
{showDemo && (
<Animated.View
  style={{
    opacity: fadeAnim,
      marginTop: 28,
    alignItems: "center",
  }}
>
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    }}
  >
    {/* IMAGE */}
    <Animated.View
      style={{
        width: 68,
        height: 68,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,

        backgroundColor:
          selectAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [
              "#1b1b1b",
              "rgba(0,255,136,0.12)",
            ],
          }),

        borderColor:
          selectAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [
              "#2a2a2a",
              "#00ff88",
            ],
          }),

        transform: [
          {
            scale: selectAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.05],
            }),
          },
        ],
      }}
    >
      {/* ICON */}
      <Animated.View
        style={{
          opacity: selectAnim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.5, 0.7, 1],
          }),
        }}
      >
        <Ionicons
         name={
  selectedDemo
    ? "checkmark-circle"
    : "image-outline"
}
          size={28}
         color={
  selectedDemo
    ? "#00ff88"
    : "#555"
}
        />
      </Animated.View>

      {/* RIPPLE */}
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          width: 68,
          height: 68,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "#00ff88",

          opacity: selectAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.35],
          }),

          transform: [
            {
              scale: selectAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.12],
              }),
            },
          ],
        }}
      />
    </Animated.View>

    {/* ARROW */}
    <Animated.View
      style={{
        opacity: folderAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),

        transform: [
          {
            translateX:
              folderAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-10, 0],
              }),
          },
        ],
      }}
    >
      <Ionicons
        name="arrow-forward"
        size={22}
        color="#00ff88"
      />
    </Animated.View>

    {/* COLLECTION */}
    <Animated.View
      style={{
        width: 74,
        height: 74,
        borderRadius: 22,
        backgroundColor:
          "rgba(0,255,136,0.10)",

        justifyContent: "center",
        alignItems: "center",

        borderWidth: 1,
        borderColor: "#00ff88",

        opacity: folderAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),

        transform: [
          {
            scale: folderAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.85, 1],
            }),
          },
        ],
      }}
    >
      <Ionicons
        name="folder"
        size={30}
        color="#00ff88"
      />
    </Animated.View>
  </View>
</Animated.View>
)}
      {/* BUTTON */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          marginTop: 28,
          backgroundColor: "#37ff00",
          paddingVertical: 16,
          borderRadius: 20,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#000",
            fontWeight: "800",
            fontSize: 15,
          }}
        >
          Go To Bookmarks
        </Text>
      </TouchableOpacity>
    </View>
  </View>
) : (
        <FlatList
          data={collections}
          keyExtractor={(item) =>
            item._id
          }
          renderItem={({ item }) => (
      <TouchableOpacity
  onPress={() =>
    router.push({
      pathname:
        "/collections/[id]",
      params: {
        id: item._id,
      },
    })
  }

onLongPress={() => {
  setSelectedCollectionId(item._id);

  setShowDeleteModal(true);

  Animated.parallel([
    Animated.spring(modalScale, {
      toValue: 1,
      useNativeDriver: true,
    }),

    Animated.timing(modalOpacity, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }),
  ]).start();
}}
  delayLongPress={700}

  activeOpacity={0.9}

  style={{
    marginBottom: 18,
  }}
>
  {/* COVER */}
  <View
    style={{
      height: 170,
      borderRadius: 26,
      overflow: "hidden",
      backgroundColor: "#111",
    }}
  >
    {item.coverImage ? (
      <Image
        source={{
          uri: item.coverImage,
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
        resizeMode="cover"
      />
    ) : (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons
          name="images-outline"
          size={42}
          color="#555"
        />
      </View>
    )}

    {/* OVERLAY */}
    <View
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        padding: 18,
        backgroundColor:
          "rgba(0,0,0,0.45)",
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 20,
          fontWeight: "800",
        }}
      >
        {item.name}
      </Text>
    </View>
  </View>
</TouchableOpacity>
          )}
        />
      )}
{/* DELETE MODAL */}
{showDeleteModal && (
<Animated.View
  style={{
    ...StyleSheet.absoluteFillObject,

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    justifyContent: "center",
    alignItems: "center",

    zIndex: 999,

    opacity: modalOpacity,
  }}
>
    {/* BLUR BACKGROUND */}
    <TouchableOpacity
      activeOpacity={1}
      onPress={() =>
        setShowDeleteModal(false)
      }
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
    >
      <BlurView
        intensity={0}
        tint="dark"
        style={{
          flex: 1,
        }}
      />
    </TouchableOpacity>

    {/* MODAL CARD */}
    <Animated.View
      style={{
        width: "88%",

        borderRadius: 28,

        overflow: "hidden",

        backgroundColor:
          "rgba(18,18,18,0.92)",

        borderWidth: 1,
        borderColor:
          "rgba(0, 0, 0, 0.06)",

        padding: 16,

        transform: [
          {
            scale: modalScale,
          },
        ],
      }}
    >
      {/* TOP ROW */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/* ICON */}
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,

            backgroundColor:
              "rgba(255,70,70,0.12)",

            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="trash-outline"
            size={22}
            color="#ff4444"
          />
        </View>

        {/* TEXT */}
        <View
          style={{
            marginLeft: 14,
            flex: 1,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 17,
              fontWeight: "800",
            }}
          >
            Delete Collection
          </Text>

          <Text
            style={{
              color: "#888",
              fontSize: 12,
              marginTop: 3,
            }}
          >
            This cannot be undone
          </Text>
        </View>
      </View>

      {/* BUTTONS */}
      <View
        style={{
          flexDirection: "row",
          marginTop: 20,
          gap: 10,
        }}
      >
        {/* CANCEL */}
        <TouchableOpacity
          onPress={() =>
            setShowDeleteModal(false)
          }
          style={{
            flex: 1,
            height: 46,

            borderRadius: 14,

            backgroundColor:
              "rgba(255,255,255,0.06)",

            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "700",
              fontSize: 14,
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>

        {/* DELETE */}
        <TouchableOpacity
          onPress={
            handleDeleteCollection
          }
          style={{
            flex: 1,
            height: 46,

            borderRadius: 14,

            backgroundColor:
              "#dd0000",

            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "800",
              fontSize: 14,
            }}
          >
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  </Animated.View>
)}
    </View>
  );
}