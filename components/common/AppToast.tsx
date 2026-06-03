import React, {
    createContext,
    useContext,
    useState,
} from "react";

import {
    Animated,
    Text
} from "react-native";

type ToastType =
  | "success"
  | "error";

type ToastData = {
  message: string;
  type: ToastType;
};

const ToastContext =
  createContext<any>(null);

export const useAppToast =
  () =>
    useContext(
      ToastContext
    );

export function AppToastProvider({
  children,
}: any) {
  const [toast, setToast] =
    useState<
      ToastData | null
    >(null);

  const opacity =
    React.useRef(
      new Animated.Value(0)
    ).current;

  const showToast = ({
    message,
    type,
  }: ToastData) => {
    setToast({
      message,
      type,
    });

    Animated.timing(
      opacity,
      {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }
    ).start();

    setTimeout(() => {
      Animated.timing(
        opacity,
        {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }
      ).start(() => {
        setToast(null);
      });
    }, 2200);
  };

  return (
    <ToastContext.Provider
      value={{
        showToast,
      }}
    >
      {children}

      {toast && (
        <Animated.View
          style={{
            position:
              "absolute",

            bottom: 110,

            alignSelf:
              "center",

            opacity,

            backgroundColor:
              toast.type ===
              "error"
                ? "rgba(255,59,48,0.92)"
                : "rgba(0,255,136,0.92)",

            paddingHorizontal:
              18,

            paddingVertical:
              14,

            borderRadius: 24,

            borderWidth: 1,

            borderColor:
              toast.type ===
              "error"
                ? "rgba(255,255,255,0.12)"
                : "rgba(255,255,255,0.08)",

            shadowColor:
              "#000",

            shadowOpacity:
              0.25,

            shadowRadius: 20,

            elevation: 12,

            zIndex: 99999,
          }}
        >
          <Text
            style={{
              color: "#fff",

              fontWeight:
                "700",

              fontSize: 14,
            }}
          >
            {toast.message}
          </Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}