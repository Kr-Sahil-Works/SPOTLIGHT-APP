import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";

const Btn = React.memo(({ label, onPress, color =
  "rgba(255,255,255,0.08)", textColor = "#fff", flex = 1 }: any) => {
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
const [lightMode, setLightMode] =
  useState(false);
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
<LinearGradient
 colors={
  lightMode
    ? [
        "#09011c",
        "#110c2a",
        "#000209",
      ]
    :  [
          "#070e0b",
          "#0a170b",
          "#000209",
        ]
}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={{ flex: 1 }}
>
    <View style={styles.container}>

      {/* HEADER */}
   <View
  style={{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  }}
>
  <TouchableWithoutFeedback
    onPress={() =>
      router.replace(
        "/(tabs)/chats"
      )
    }
  >
    <View
      style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor:
          lightMode
            ? "#6e809dfc"
            : "rgba(34,197,94,0.12)",

        borderWidth: 1,

        borderColor:
          "rgba(34,197,94,0.15)",

        alignItems:
          "center",

        justifyContent:
          "center",
      }}
    >
      <Ionicons
        name="chevron-back"
        size={24}
        color={
          lightMode
            ? "#111"
            : "#22c55e"
        }
      />
    </View>
  </TouchableWithoutFeedback>

  <View
    style={{
      flexDirection: "row",
      gap: 12,
    }}
  >
    <TouchableWithoutFeedback
      onPress={() =>
        setLightMode(
          !lightMode
        )
      }
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,

          backgroundColor:
            lightMode
              ? "#6e809dfc"
              : "rgba(255,255,255,0.06)",

          alignItems:
            "center",

          justifyContent:
            "center",
        }}
      >
        <Ionicons
          name={
          lightMode
  ? "moon"
  : "contrast-outline"
          }
          size={20}
          color={
            lightMode
              ? "#111"
              : "#22c55e"
          }
        />
      </View>
    </TouchableWithoutFeedback>

    <TouchableWithoutFeedback
      onPress={handleCopy}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,

          backgroundColor:
            lightMode
              ? "#6e809dfc"
              : "rgba(255,255,255,0.06)",

          alignItems:
            "center",

          justifyContent:
            "center",
        }}
      >
        <Ionicons
          name={
            copied
              ? "checkmark"
              : "copy-outline"
          }
          size={20}
          color={
            lightMode
              ? "#111"
              : "#22c55e"
          }
        />
      </View>
    </TouchableWithoutFeedback>
  </View>
</View>

      {/* DISPLAY */}
      <View style={styles.display}>
        <Text
  style={[
    styles.input,
    {
      color: "#e2dcdc",
    },
  ]}
>
          {valueRef.current || "0"}
        </Text>

     <Text
  style={[
    styles.result,
    {
      color:
        lightMode
          ? "#2563eb"
          : "#22c55e",
    },
  ]}
>
          {result}
        </Text>
      </View>

      {/* KEYPAD */}
<View style={styles.keypad}>

  <View style={styles.row}>
    <Btn
      label="C"
      color={
        lightMode
          ? "#425b83fc"
          : "#0a120c"
      }
      textColor={
        lightMode
          ? "#ebe7e7"
          : "#e4e2e2"
      }
      onPress={press}
    />

    <Btn
      label="("
        color={
        lightMode
          ? "#16243baa"
          : "rgba(255,255,255,0.04)"
      }
      textColor={
        lightMode
          ? "#c0c0c0"
          : "#d1d5db"
      }
      onPress={press}
    />

    <Btn
      label=")"
      color={
        lightMode
          ? "#16243baa"
          : "rgba(255,255,255,0.04)"
      }
      textColor={
        lightMode
          ? "#c0c0c0"
          : "#d1d5db"
      }
      onPress={press}
    />

    <Btn
      label="←"
      color={
        lightMode
          ? "#a61a1a"
          : "#1d1d1d"
      }
      onPress={press}
    />
  </View>

  <View style={styles.row}>
    <Btn label="7" onPress={press} />
    <Btn label="8" onPress={press} />
    <Btn label="9" onPress={press} />

    <Btn
      label="/"
      color={
        lightMode
          ? "#2563EB"
          : "#1d1d1d"
      }
      onPress={press}
    />
  </View>

  <View style={styles.row}>
    <Btn label="4" onPress={press} />
    <Btn label="5" onPress={press} />
    <Btn label="6" onPress={press} />

    <Btn
      label="×"
      color={
        lightMode
          ? "#4F46E5"
          : "#1d1d1d"
      }
      onPress={() =>
        press("*")
      }
    />
  </View>

  <View style={styles.row}>
    <Btn label="1" onPress={press} />
    <Btn label="2" onPress={press} />
    <Btn label="3" onPress={press} />

    <Btn
      label="−"
      color={
        lightMode
          ? "#7C3AED"
          : "#1d1d1d"
      }
      onPress={() =>
        press("-")
      }
    />
  </View>

  <View style={styles.row}>
    <Btn
      label="0"
      flex={2}
      onPress={press}
    />

    <Btn
      label="."
      onPress={press}
    />

    <Btn
      label="+"
      color={
        lightMode
          ? "#b12f72"
          : "#086808"
      }
      onPress={press}
    />
  </View>

</View>
    </View>
    </LinearGradient>
  );
}

/* STYLES */

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

  paddingBottom: 24,
},

input: {
  color: "#fff",
fontSize: 76,
fontWeight: "300",
letterSpacing: -2,
  textAlign: "right",
},

result: {
  color: "#22c55e",

  fontSize: 40,

  fontWeight: "700",

  textAlign: "right",

  marginTop: 8,
},

keypad: {
  paddingBottom: 12,
  marginTop: 20,
},

  row: {
    flexDirection: "row",
  },

btn: {
  margin: 7,

  height: 72,

  borderRadius: 26,

  backgroundColor:
    "#ffffff12",

  borderWidth: 1,

  borderColor:
    "#ffffff14",

  justifyContent: "center",

  alignItems: "center",

  shadowColor: "#000",

  shadowOpacity: 0.25,

  shadowRadius: 12,
},

btnText: {
  fontSize: 28,

  fontWeight: "600",
},
});