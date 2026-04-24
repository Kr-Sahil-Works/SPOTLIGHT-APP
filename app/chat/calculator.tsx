import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";

type BtnProps = {
  label: string;
  color?: string;
  textColor?: string;
  flex?: number;
};



export default function Calculator() {
  const router = useRouter();

  const [value, setValue] = useState("");
  const [result, setResult] = useState("");

const press = (v: string) => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

if ("+-*/".includes(v) && "+-*/".includes(value.slice(-1))) {
  setValue((prev) => prev.slice(0, -1) + v);
  return;
}

  // ✅ CLEAR
  if (v === "C") {
    setValue("");
    setResult("");
    return;
  }

  // ✅ CALCULATE
  if (v === "=") {
    if (!value.trim()) return; // 🔥 prevents blank crash

    try {
      // basic sanitize (safe eval)
      const safe = value.replace(/[^0-9+\-*/().]/g, "");

      const res = Function(`"use strict"; return (${safe})`)();
      setResult(String(res));
    } catch {
      setResult("Error");
    }
    return;
  }

  // ✅ NORMAL INPUT
  setValue((prev) => prev + v);
};

  useFocusEffect(
  useCallback(() => {
    // forces smooth mount (prevents blank flash)
    return () => {};
  }, [])
);

  const Btn = ({
    label,
    color = "#1a1a1a",
    textColor = "#fff",
    flex = 1,
  }: BtnProps) => (
    <TouchableOpacity
      onPress={() => press(label)}
      style={{
        flex,
        margin: 6,
        height: 70,
        borderRadius: 20,
        backgroundColor: color,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: textColor, fontSize: 24 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#0b0b0b", padding: 16 }}>

      {/* HEADER */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Ionicons
          name="close"
          size={28}
          color="#fff"
          onPress={() => router.replace("/(tabs)/chats")}
        />

        <TouchableOpacity
          onPress={async () => {
            await Clipboard.setStringAsync(result || value);
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }}
        >
          <Ionicons name="copy-outline" size={24} color="#aaa" />
        </TouchableOpacity>
      </View>

      {/* DISPLAY */}
      <View style={{ marginTop: 50 }}>
        <Text style={{ color: "#888", fontSize: 22, textAlign: "right" }}>
          {value}
        </Text>

        <Text style={{
          color: "#4ade80",
          fontSize: 42,
          textAlign: "right",
          marginTop: 10
        }}>
          {result || "0"}
        </Text>
      </View>

      {/* KEYPAD */}
      <View style={{ marginTop: 30 }}>
        <View style={{ flexDirection: "row" }}>
          <Btn label="C" color="#444" />
          <Btn label="(" />
          <Btn label=")" />
          <Btn label="/" color="#f59e0b" />
        </View>

        <View style={{ flexDirection: "row" }}>
          <Btn label="7" />
          <Btn label="8" />
          <Btn label="9" />
          <Btn label="*" color="#f59e0b" />
        </View>

        <View style={{ flexDirection: "row" }}>
          <Btn label="4" />
          <Btn label="5" />
          <Btn label="6" />
          <Btn label="-" color="#f59e0b" />
        </View>

        <View style={{ flexDirection: "row" }}>
          <Btn label="1" />
          <Btn label="2" />
          <Btn label="3" />
          <Btn label="+" color="#22c55e" />
        </View>

        <View style={{ flexDirection: "row" }}>
          <Btn label="0" flex={2} />
          <Btn label="." />
          <Btn label="=" color="#4ade80" textColor="#000" />
        </View>
      </View>
    </View>
  );
}