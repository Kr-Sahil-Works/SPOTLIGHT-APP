import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";

const Btn = React.memo(({ label, onPress, color = "#141414", textColor = "#fff", flex = 1 }: any) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[{ flex }, animatedStyle]}>
      <TouchableWithoutFeedback
        onPress={() => onPress(label)}
        onPressIn={() => {
          scale.value = withSpring(0.9);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
      >
        <View style={[styles.btn, { backgroundColor: color }]}>
          <Text style={[styles.btnText, { color: textColor }]}>
            {label}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
});

export default function Calculator() {
  const router = useRouter();

  const valueRef = useRef("");
  const [, forceUpdate] = useState(0);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  // ⚡ INPUT (NO RE-RENDER COST)
  const press = useCallback((v: string) => {
    Haptics.selectionAsync();

    let val = valueRef.current;

    if (v === "C") {
      valueRef.current = "";
      setResult("");
      forceUpdate(n => n + 1);
      return;
    }

    if (v === "⌫") {
      valueRef.current = val.slice(0, -1);
      forceUpdate(n => n + 1);
      return;
    }

    if ("+-*/".includes(v) && "+-*/".includes(val.slice(-1))) {
      valueRef.current = val.slice(0, -1) + v;
      forceUpdate(n => n + 1);
      return;
    }

    valueRef.current = val + v;
    forceUpdate(n => n + 1);
  }, []);

  // ⚡ CALC (ASYNC FEEL, NON-BLOCKING)
  useEffect(() => {
    const t = setTimeout(() => {
      const val = valueRef.current;

      if (!val.trim()) {
        setResult("");
        return;
      }

      try {
        const safe = val.replace(/[^0-9+\-*/().]/g, "");
        const res = Function(`"use strict"; return (${safe})`)();
        setResult(String(res));
      } catch {
        setResult("");
      }
    }, 120);

    return () => clearTimeout(t);
  }, [valueRef.current]);

  // 📋 COPY
  const handleCopy = async () => {
    const text = result || valueRef.current;
    if (!text) return;

    await Clipboard.setStringAsync(text);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text
          onPress={() => router.replace("/(tabs)/chats")}
          style={styles.back}
        >
          ← Back
        </Text>

        <Text onPress={handleCopy} style={styles.copy}>
          <Ionicons
            name={copied ? "checkmark" : "copy-outline"}
            size={22}
            color="#22c55e"
          />
        </Text>
      </View>

      {/* DISPLAY */}
      <View style={styles.display}>
        <Text style={styles.input}>
          {valueRef.current || "0"}
        </Text>

        <Text style={styles.result}>
          {result}
        </Text>
      </View>

      {/* KEYPAD */}
      <View style={styles.keypad}>

        <View style={styles.row}>
          <Btn label="C" color="#2a2a2a" onPress={press} />
          <Btn label="(" onPress={press} />
          <Btn label=")" onPress={press} />
          <Btn label="⌫" color="#ef4444" onPress={press} />
        </View>

        <View style={styles.row}>
          <Btn label="7" onPress={press} />
          <Btn label="8" onPress={press} />
          <Btn label="9" onPress={press} />
          <Btn label="/" color="#f59e0b" onPress={press} />
        </View>

        <View style={styles.row}>
          <Btn label="4" onPress={press} />
          <Btn label="5" onPress={press} />
          <Btn label="6" onPress={press} />
          <Btn label="*" color="#f59e0b" onPress={press} />
        </View>

        <View style={styles.row}>
          <Btn label="1" onPress={press} />
          <Btn label="2" onPress={press} />
          <Btn label="3" onPress={press} />
          <Btn label="-" color="#f59e0b" onPress={press} />
        </View>

        <View style={styles.row}>
          <Btn label="0" flex={2} onPress={press} />
          <Btn label="." onPress={press} />
          <Btn label="+" color="#22c55e" onPress={press} />
        </View>

      </View>
    </View>
  );
}

/* STYLES */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0b",
    padding: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  back: {
    color: "#22c55e",
    fontSize: 16,
  },

  copy: {
    padding: 10,
  },

  display: {
    flex: 1,
    justifyContent: "flex-end",
  },

  input: {
    color: "#fff",
    fontSize: 48,
    textAlign: "right",
  },

  result: {
    color: "#4ade80",
    fontSize: 28,
    textAlign: "right",
  },

  keypad: {
    paddingBottom: 10,
  },

  row: {
    flexDirection: "row",
  },

  btn: {
    margin: 6,
    height: 68,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },

  btnText: {
    fontSize: 24,
  },
});