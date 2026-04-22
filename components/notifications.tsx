import { Loader } from "@/components/Loader";
import Notification from "@/components/Notification";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/notifications.styles";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useEffect, useRef } from "react";
import { Animated, Easing, FlatList, Text, View } from "react-native";

export default function Notifications() {
  const notifications = useQuery(api.notifications.getNotifications);

  if (notifications === undefined) return <Loader />;
  if (notifications.length === 0) return <NoNotificationsFound />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <Ionicons name="notifications" size={22} color={COLORS.primary} />
      </View>

      <FlatList
        data={notifications}
        renderItem={({ item }) => <Notification notification={item} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

function AnimatedDots() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (val: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, {
            toValue: 1,
            duration: 350,
            delay,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(val, {
            toValue: 0,
            duration: 350,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      );

    animate(dot1, 0).start();
    animate(dot2, 120).start();
    animate(dot3, 240).start();
  }, []);

  const style = (anim: Animated.Value) => ({
    opacity: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1.2], // WhatsApp style pulse
        }),
      },
    ],
  });

  return (
    <View style={{ flexDirection: "row", gap: 8, marginTop: 24 }}>
      <Animated.View style={[dotStyle, style(dot1)]} />
      <Animated.View style={[dotStyle, style(dot2)]} />
      <Animated.View style={[dotStyle, style(dot3)]} />
    </View>
  );
}

function NoNotificationsFound() {
  return (
    <View style={[styles.container, styles.centered]}>
      {/* ICON */}
      <View
        style={{
          width: 90,
          height: 90,
          borderRadius: 45,
          backgroundColor: "#111",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: COLORS.surface,
        }}
      >
        <Ionicons
          name="notifications-outline"
          size={40}
          color={COLORS.primary}
        />
      </View>

      {/* TITLE */}
      <Text
        style={{
          marginTop: 20,
          fontSize: 22,
          color: COLORS.white,
          fontWeight: "600",
        }}
      >
        No Notifications Yet
      </Text>

      {/* SUBTEXT */}
      <Text
        style={{
          marginTop: 8,
          fontSize: 14,
          color: COLORS.grey,
          textAlign: "center",
          paddingHorizontal: 30,
          lineHeight: 20,
        }}
      >
        When someone likes, follows, or comments,
        {"\n"}you’ll see it here.
      </Text>

      {/* 🔥 Animated typing dots */}
      <AnimatedDots />
    </View>
  );
}

const dotStyle = {
  width: 6,
  height: 6,
  borderRadius: 3,
  backgroundColor: COLORS.surface,
};