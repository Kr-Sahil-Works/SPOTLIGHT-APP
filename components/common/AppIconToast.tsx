import React, {
  useEffect,
  useRef,
  useState
} from "react";

import {
  Animated,
  BackHandler,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import * as Haptics from "expo-haptics";

type Props = {
  visible: boolean;
  iconName: string;
  onClose: () => void;
};

const STATUS = [
  "Preparing app icon...",
  "Updating launcher...",
  "Syncing launcher...",
  "Almost ready...",
  "Icon Ready ✨",
];

const themeColors: Record<string, string> = {
  Green: "#22C55E",
  Purple: "#A855F7",
  Blue: "#248ee4",
  Teal: "#14B8A6",
  Orange: "#F97316",
  "Memory Map": "#ccc616",
  "Memory Timeline": "#b548ec",
};



export default function AppIconToast({
  visible,
  iconName,
  onClose,
}: Props) {
  const translateY = useRef(
    new Animated.Value(120)
  ).current;

  const opacity = useRef(
    new Animated.Value(0)
  ).current;

  const headerFade = useRef(
  new Animated.Value(1)
).current;

const headerScale = useRef(
  new Animated.Value(1)
).current;

  const statusOpacity = useRef(
  new Animated.Value(1)
).current;

  const progress = useRef(
    new Animated.Value(0)
  ).current;

  const buttonOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const shimmer = useRef(
    new Animated.Value(-220)
  ).current;

  const successScale = useRef(
  new Animated.Value(0)
).current;

const ringScale = useRef(
  new Animated.Value(0)
).current;

const ringOpacity = useRef(
  new Animated.Value(0)
).current;

const pulse = useRef(
  new Animated.Value(1)
).current;

const checkPulse = useRef(
  new Animated.Value(1)
).current;

const infoGlow = useRef(
  new Animated.Value(0.15)
).current;

  const [percent, setPercent] =
    useState(0);

  const [statusIndex, setStatusIndex] =
    useState(0);

    const [headerComplete, setHeaderComplete] =
  useState(false);

  const [showCheck, setShowCheck] =
  useState(false);

    const [countdown, setCountdown] =
  useState(15);

  const progressWidth =
    progress.interpolate({
      inputRange: [0, 100],
      outputRange: ["0%", "100%"],
    });

  const shimmerTranslate =
    shimmer.interpolate({
      inputRange: [-220, 220],
      outputRange: [-220, 220],
    });

  useEffect(() => {
    const listener =
      progress.addListener(
        ({ value }) => {
          setPercent(
            Math.floor(value)
          );
        }
      );

    return () => {
      progress.removeListener(
        listener
      );
    };
  }, []);

  useEffect(() => {
  if (!visible) return;

  Animated.loop(
  Animated.sequence([
    Animated.timing(infoGlow, {
      toValue: 0.32,
      duration: 2200,
      useNativeDriver: true,
    }),
    Animated.timing(infoGlow, {
      toValue: 0.15,
      duration: 2200,
      useNativeDriver: true,
    }),
  ])
).start();

  const sub = BackHandler.addEventListener(
    "hardwareBackPress",
    () => true
  );

  return () => sub.remove();
}, [visible]);

  useEffect(() => {
    if (!visible) return;

    progress.setValue(0);
    successScale.setValue(0);
ringScale.setValue(0);
ringOpacity.setValue(0);

    buttonOpacity.setValue(0);

   Animated.sequence([
  Animated.timing(statusOpacity, {
    toValue: 0,
    duration: 120,
    useNativeDriver: true,
  }),

  Animated.timing(statusOpacity, {
    toValue: 1,
    duration: 180,
    useNativeDriver: true,
  }),
]).start();

setStatusIndex(0);
setShowCheck(false);
    setCountdown(25);

    Animated.parallel([
      Animated.spring(
        translateY,
        {
          toValue: 0,
          damping: 18,
          stiffness: 180,
          useNativeDriver: true,
        }
      ),

      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),

      Animated.timing(progress, {
        toValue: 100,
        duration: 4500,
        easing:
          Easing.inOut(
            Easing.cubic
          ),
        useNativeDriver: false,
      }),
    ]).start();

    Animated.loop(
      Animated.timing(
        shimmer,
        {
          toValue: 220,
          duration: 1200,
          easing:
            Easing.linear,
          useNativeDriver: true,
        }
      )
    ).start();

   let interval: ReturnType<typeof setInterval> | undefined;

const animateStatus = (index: number) => {
  Animated.sequence([
    Animated.timing(statusOpacity, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }),
    Animated.timing(statusOpacity, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }),
  ]).start();

  setStatusIndex(index);
};

const t1 = setTimeout(() => {
  animateStatus(1);
}, 1200);

const t2 = setTimeout(() => {
  animateStatus(2);
}, 2400);

const t3 = setTimeout(() => {
  animateStatus(3);
}, 3600);

const t4 = setTimeout(() => {
  animateStatus(4);

  const pulseLoop = Animated.loop(
  Animated.sequence([
    Animated.timing(pulse, {
      toValue: 1.015,
      duration: 900,
      useNativeDriver: true,
    }),
    Animated.timing(pulse, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }),
  ])
);
setShowCheck(true);

  Haptics.notificationAsync(
    Haptics.NotificationFeedbackType.Success
  );

  Animated.sequence([
    Animated.parallel([
      Animated.spring(successScale, {
        toValue: 1,
        damping: 10,
        stiffness: 180,
        useNativeDriver: true,
      }),

      Animated.timing(ringScale, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),

      Animated.timing(ringOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]),

    Animated.timing(ringOpacity, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }),
 ]).start(() => {
  setTimeout(() => {
Animated.parallel([
  Animated.sequence([
    Animated.timing(headerFade, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }),

    Animated.timing(headerFade, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }),
  ]),

  Animated.sequence([
    Animated.timing(headerScale, {
      toValue: 0.96,
      duration: 180,
      useNativeDriver: true,
    }),

    Animated.spring(headerScale, {
      toValue: 1,
      damping: 16,
      stiffness: 180,
      useNativeDriver: true,
    }),
  ]),
]).start();

    setHeaderComplete(true);
  }, 1000);
});

Animated.loop(
  Animated.sequence([
    Animated.delay(7000),

    Animated.timing(checkPulse, {
      toValue: 1.02,
      duration: 260,
      useNativeDriver: true,
    }),

    Animated.timing(checkPulse, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true,
    }),
  ])
).start();

  Animated.spring(buttonOpacity, {
    toValue: 1,
    damping: 15,
    stiffness: 180,
    useNativeDriver: true,
  }).start();

  interval = setInterval(() => {
  setCountdown((prev) => {
  if (prev === 5) {
    pulseLoop.start();
  }

  if (prev <= 1) {
    pulseLoop.stop();

    clearInterval(interval);
    onClose();
    return 0;
  }

  return prev - 1;
});
  }, 1000);

}, 4600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
if (interval) {
  clearInterval(interval);
}
      shimmer.stopAnimation();
    };
  }, [visible]);

  useEffect(() => {
    if (visible) return;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),

      Animated.timing(
        translateY,
        {
          toValue: 120,
          duration: 180,
          useNativeDriver: true,
        }
      ),
    ]).start();
  }, [visible]);

  

  return (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    statusBarTranslucent
    onRequestClose={() => {}}
  >
    <>
  <BlurView
    intensity={35}
    tint="dark"
    style={StyleSheet.absoluteFill}
  />

  <View
    style={[
      StyleSheet.absoluteFill,
      {
        backgroundColor: "rgba(0, 0, 0, 0.83)",
      },
    ]}
  />
    <Animated.View
      style={{
        position: "absolute",
        left: 18,
        right: 18,
        bottom: 90,
        opacity,
        transform: [
          {
            translateY,
          },
        ],
      }}
    >

          <BlurView
        intensity={30}
        tint="dark"
        style={{
          overflow: "hidden",
          borderRadius: 30,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.08)",
          backgroundColor: "rgba(8,10,10,0.95)",
        }}
      >
        <View
          style={{
            padding: 22,
          }}
        >
          {/* Header */}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
           <View
  style={{
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <Animated.View
    style={{
      position: "absolute",
      top: -2,
left: -2,
    width: 56,
height: 56,
      borderRadius: 999,
      borderWidth: 2,
      borderColor: "#22c55e",
      opacity: ringOpacity,
      transform: [
        {
          scale: ringScale.interpolate({
            inputRange: [0, 1],
           outputRange: [0.7, 1.45],
          }),
        },
      ],
    }}
  />

{showCheck ? (
  <Animated.View
    style={{
      transform: [
        {
          scale: Animated.multiply(
            successScale.interpolate({
              inputRange: [0, 0.8, 1],
              outputRange: [0.2, 1.3, 1],
            }),
            checkPulse
          ),
        },
      ],
    }}
  >
    <Ionicons
      name="checkmark-circle"
      size={30}
      color={
        headerComplete
          ? themeColors[iconName] ??
            "#22C55E"
          : "#22C55E"
      }
    />
  </Animated.View>
) : (
  <Ionicons
    name="color-palette"
    size={28}
    color={
      themeColors[iconName] ??
      "#22C55E"
    }
  />
)}
</View>

          <Animated.View
  style={{
    marginLeft: 14,
    flex: 1,
    opacity: headerFade,
    transform: [
      {
        scale: headerScale,
      },
    ],
  }}
>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "800",
                }}
              >
                {headerComplete
  ? "New Icon Applied"
  : "Applying New Icon"}
              </Text>

              <Text
                style={{
                color:
  headerComplete
    ? themeColors[iconName] ??
      "#22C55E"
    : "#9CA3AF",
                  marginTop: 4,
                  fontSize:15,
fontWeight:"700",
                }}
              >
                {iconName}
              </Text>
           </Animated.View>

            <Text
              style={{
                color: "#00D84A",
                fontWeight: "800",
                fontSize: 16,
              }}
            >
              {percent}%
            </Text>
          </View>

          {/* Status */}

          <Animated.Text
            style={{
              color: "#E5E7EB",
              marginTop: 22,
              fontSize: 15,
              fontWeight: "600",
            opacity: statusOpacity,
            }}
          >
            {STATUS[statusIndex]}
          </Animated.Text>
          {/* Progress */}

          <View
            style={{
              marginTop: 22,
              height: 12,
              borderRadius: 999,
              overflow: "hidden",
              backgroundColor: "#171717",
            }}
          >
            <Animated.View
              style={{
                width: progressWidth,
                height: "100%",
                overflow: "hidden",
                borderRadius: 999,
              }}
            >
              <LinearGradient
                colors={[
                  "#7C3AED",
                  "#3B82F6",
                  "#06B6D4",
                  "#22C55E",
                  "#EAB308",
                  "#F97316",
                  "#EF4444",
                ]}
                start={{
                  x: 0,
                  y: 0,
                }}
                end={{
                  x: 1,
                  y: 0,
                }}
                style={{
                  flex: 1,
                }}
              />

              <Animated.View
                pointerEvents="none"
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  width: 80,
                  backgroundColor:
                    "rgba(255,255,255,0.28)",
                  transform: [
                    {
                      translateX:
                        shimmerTranslate,
                    },
                  ],
                }}
              />
            </Animated.View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent:
                "space-between",
              marginTop: 8,
            }}
          >
            <Text
              style={{
                color: "#6B7280",
                fontSize: 11,
              }}
            >
              Processing...
            </Text>

            <Text
              style={{
                color: "#6B7280",
                fontSize: 11,
              }}
            >
              Launcher Update
            </Text>
          </View>

        <View
  style={{
    marginTop: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.12)",
  }}
>
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    }}
  >
    <Ionicons
      name="checkmark-circle"
      size={18}
      color="#22c55e"
    />

    <Text
      style={{
        marginLeft: 8,
        color: "#22c55e",
        fontWeight: "700",
        fontSize: 14,
        flex: 1,
      }}
    >
      Icon updated successfully
    </Text>

  </View>

<Text
  style={{
    color: "#8B949E",
    fontSize: 12,
    lineHeight: 20,
  }}
>
<Ionicons
  name="alert-circle-outline"
  size={15}
  color="#7EE787"
  style={{
    transform: [{ translateY: 3 }],
  }}
/>{" "}
  <Text
    style={{
      fontWeight: "700",
      color: "#9CA3AF",
    }}
  >
    Note:  
  </Text>{" "}
  Some Android launchers cache app icons. If your new icon doesn't appear immediately, restart your launcher or device.
</Text>
</View>

              <Animated.View
            style={{
              opacity: buttonOpacity,
           transform: [
  {
    translateY: buttonOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 0],
    }),
  },
  {
    scale: Animated.multiply(
      buttonOpacity,
      pulse
    ),
  },
],
            }}
          >
            <Pressable
  disabled={countdown <= 0}
              onPress={onClose}
              android_ripple={{
                color: "rgba(255,255,255,0.08)",
              }}
              style={{
                marginTop: 22,
                height: 56,
                borderRadius: 18,
                overflow: "hidden",
                shadowColor: "#22c55e",
shadowOpacity: countdown <= 5 ? 0.55 : 0.18,
shadowRadius: countdown <= 5 ? 18 : 8,
shadowOffset: {
  width: 0,
  height: 0,
},
elevation: countdown <= 5 ? 14 : 5,
              }}
            >
              <LinearGradient
                colors={[
                  "#22C55E",
                  "#00D84A",
                  "#7CFF6B",
                ]}
                start={{
                  x: 0,
                  y: 0,
                }}
                end={{
                  x: 1,
                  y: 0,
                }}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Ionicons
                  name="refresh"
                  size={20}
                  color="#041107"
                />

                <Text
                  style={{
                    marginLeft: 10,
                    color: "#041107",
                    fontWeight: "800",
                    fontSize: 15,
                  }}
                >
                  {`Close & Refresh (${countdown})`}
                </Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>

          <Text
            style={{
              color: "#6B7280",
              textAlign: "center",
              marginTop: 16,
              fontSize: 11,
            }}
          >
         MilesSpot will close automatically to
finish updating your app icon.
          </Text>
        </View>
      </BlurView>
    </Animated.View>
    </>
  </Modal>
  );
}      