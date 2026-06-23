import { Ionicons } from "@expo/vector-icons";
import React, {
  useEffect,
  useState,
} from "react";
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;

  initialValue?: string;
  onRemove?: () => void;

  onSave: (
    phone: string
  ) => void;
};

export default function ContactNumberModal({
  visible,
  onClose,
  onRemove,
  initialValue = "",
  onSave,
}: Props) {
  const [phone, setPhone] =
    useState("");

  useEffect(() => {
    setPhone(initialValue);
  }, [
    initialValue,
    visible,
  ]);

  const valid =
    /^[6-9]\d{9}$/.test(
      phone
    );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View
        style={{
          flex: 1,
          backgroundColor:
            "rgba(0,0,0,0.55)",

          justifyContent:
            "center",

          padding: 22,
        }}
      >
        <View
          style={{
            backgroundColor:
              "#0f0f0f",

            borderRadius: 28,

            padding: 22,

            borderWidth: 1,

            borderColor:
              "#ffffff10",
          }}
        >
          <View
            style={{
              alignItems:
                "center",
            }}
          >
            <View
              style={{
                width: 70,
                height: 70,

                borderRadius:
                  999,

                backgroundColor:
                  "rgba(34,197,94,0.12)",

                alignItems:
                  "center",

                justifyContent:
                  "center",
              }}
            >
              <Ionicons
                name="call"
                size={32}
                color="#22c55e"
              />
            </View>

            <Text
              style={{
                color: "#fff",

                fontSize: 20,

                fontWeight:
                  "700",

                marginTop: 16,
              }}
            >
              Contact Number
            </Text>

            <Text
              style={{
                color:
                  "#8e8e93",

                textAlign:
                  "center",

                marginTop: 8,

                lineHeight: 22,
              }}
            >
              Enter the phone
              number shared for
              WhatsApp,
              Telegram and Calls
            </Text>
          </View>

          <TextInput
            value={phone}
            onChangeText={(
              t
            ) => {
              const clean =
                t.replace(
                  /\D/g,
                  ""
                );

              if (
                clean.length <=
                10
              ) {
                setPhone(
                  clean
                );
              }
            }}
            keyboardType="number-pad"
            placeholder="9876543210"
            placeholderTextColor="#666"
            maxLength={10}
            style={{
              marginTop: 24,

              height: 58,

              borderRadius: 18,

              backgroundColor:
                "#151515",

              borderWidth: 1,

              borderColor:
                "#ffffff08",

              color: "#fff",

              paddingHorizontal: 18,

              fontSize: 18,

              textAlign:
                "center",

              letterSpacing: 1,
            }}
          />

          <View
            style={{
              flexDirection:
                "row",

              gap: 12,

              marginTop: 24,
            }}
          >
            <TouchableOpacity
              onPress={
                onClose
              }
              style={{
                flex: 1,

                height: 52,

                borderRadius:
                  18,

                backgroundColor:
                  "#181818",

                justifyContent:
                  "center",

                alignItems:
                  "center",
              }}
            >
              <Text
                style={{
                  color:
                    "#fff",

                  fontWeight:
                    "600",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={
                !valid
              }
              onPress={() => {
                onSave(
                  phone
                );

                onClose();
              }}
              style={{
                flex: 1,

                height: 52,

                borderRadius:
                  18,

                justifyContent:
                  "center",

                alignItems:
                  "center",

                backgroundColor:
                  valid
                    ? "#22c55e"
                    : "#14532d",

                opacity:
                  valid
                    ? 1
                    : 0.5,
              }}
            >
              <Text
                style={{
                  color:
                    "#000",

                  fontWeight:
                    "700",
                }}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
          {initialValue?.length ===
  10 && (
  <TouchableOpacity
    onPress={
      onRemove
    }
    style={{
      marginTop: 10,

      height: 48,

      borderRadius: 14,

      justifyContent:
        "center",

      alignItems:
        "center",

      backgroundColor:
        "#7f1d1d",
    }}
  >
    <Text
      style={{
        color: "#fff",

        fontWeight:
          "700",
      }}
    >
      Remove Number
    </Text>
  </TouchableOpacity>
)}
        </View>
      </View>
    </Modal>
  );
}