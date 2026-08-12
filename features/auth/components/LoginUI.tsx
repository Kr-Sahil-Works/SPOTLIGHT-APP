import GreenLoader from "@/components/loaders/GreenLoader";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Platform,
    Pressable,
    Text,
    View,
} from "react-native";

type LoginUIProps = {
  loading: boolean;
  isOnline: boolean;
  isSignedIn: boolean;
  onGooglePress: () => void;
};

export default function LoginUI({
  loading,
  isOnline,
  isSignedIn,
  onGooglePress,
}: LoginUIProps) {
  const router = useRouter();

  const images = [
    require("../../../assets/images/loginpage/login1.webp"),
    require("../../../assets/images/loginpage/login2.webp"),
    require("../../../assets/images/loginpage/login3.webp"),
    require("../../../assets/images/loginpage/login4.webp"),
    require("../../../assets/images/loginpage/login5.webp"),
  ];

  const [currentImage, setCurrentImage] =
    useState(0);

  const pressScale =
    useRef(new Animated.Value(1)).current;

  const morph =
    useRef(new Animated.Value(0)).current;

  const sweep =
    useRef(new Animated.Value(-250)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(
        (prev) => (prev + 1) % images.length
      );
    }, 4200);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== "android") {
      return;
    }

    const animation = Animated.timing(
      sweep,
      {
        toValue: 250,
        duration: 450,
        useNativeDriver: true,
      }
    );

    sweep.setValue(-250);
    animation.start();

    return () => {
      animation.stop();
    };
  }, []);

  useEffect(() => {
    if (loading) {
      Animated.timing(morph, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      sweep.setValue(-250);

      Animated.timing(sweep, {
        toValue: 250,
        duration: 450,
        useNativeDriver: true,
      }).start();

      return;
    }

    Animated.timing(morph, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [loading]);

  const pressIn = () => {
    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    ).catch(() => {});

    Animated.spring(pressScale, {
      toValue: 0.96,
      speed: 40,
      bounciness: 4,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      speed: 40,
      bounciness: 6,
      useNativeDriver: true,
    }).start();
  };

  const textOpacity =
    morph.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });

  const loaderOpacity =
    morph.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

  const scaleX =
    morph.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.9],
    });

  return (
    <View style={styles.container}>
      <View style={styles.brandSection}>
        <View style={styles.logoContainer}>
          <Ionicons
            name="leaf"
            size={32}
            color={COLORS.primary}
          />
        </View>

        <Text style={styles.appName}>
          MilesSpot
        </Text>

        <Text style={styles.tagline}>
          don't miss anything
        </Text>
      </View>

      <View style={styles.illustrationContainer}>
        <Image
          source={images[currentImage]}
          style={styles.illustration}
          contentFit="contain"
          cachePolicy="memory-disk"
          allowDownscaling
          transition={1200}
        />
      </View>

      <View style={styles.loginSection}>
        <Animated.View
          style={{
            transform: [
              {
                scale: pressScale,
              },
              {
                scaleX,
              },
            ],
          }}
        >
          <Pressable
            onPress={onGooglePress}
            onPressIn={pressIn}
            onPressOut={pressOut}
            disabled={
              loading ||
              !isOnline ||
              isSignedIn
            }
            android_ripple={{
              color:
                "rgba(255,255,255,0.25)",
            }}
            style={[
              styles.googleButton,
              !isOnline && {
                opacity: 0.5,
              },
              {
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              },
            ]}
          >
            <Animated.View
              style={{
                position: "absolute",
                width: 250,
                height: "100%",
                transform: [
                  {
                    translateX: sweep,
                  },
                ],
              }}
            >
              <LinearGradient
                colors={[
                  "transparent",
                  "rgba(255,255,255,0.25)",
                  "transparent",
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
            </Animated.View>

            <Animated.View
              style={{
                flexDirection: "row",
                alignItems: "center",
                opacity: textOpacity,
              }}
            >
              <View
                style={
                  styles.googleIconContainer
                }
              >
                <Ionicons
                  name="logo-google"
                  size={20}
                  color={COLORS.surface}
                />
              </View>

              <Text
                style={
                  styles.googleButtonText
                }
              >
                Continue with Google
              </Text>
            </Animated.View>

            <Animated.View
              style={{
                position: "absolute",
                opacity: loaderOpacity,
              }}
            >
              <GreenLoader />
            </Animated.View>
          </Pressable>

          {!isOnline && (
            <Text
              style={{
                color: "#888",
                textAlign: "center",
                marginTop: 10,
                fontSize: 12,
              }}
            >
              Internet connection required
              {" "}to sign in
            </Text>
          )}
        </Animated.View>

        <Text style={styles.termsText}>
          By continuing, you agree to our{" "}

          <Text
            style={{
              color: "#22c55e",
              textDecorationLine:
                "underline",
              fontWeight: "700",
            }}
            onPress={() =>
              router.push(
                "/(settings)/policy/terms-and-conditions"
              )
            }
          >
            Terms
          </Text>

          {" "}and{" "}

          <Text
            style={{
              color: "#22c55e",
              textDecorationLine:
                "underline",
              fontWeight: "700",
            }}
            onPress={() =>
              router.push(
                "/(settings)/policy/privacy-policy"
              )
            }
          >
            Privacy Policy
          </Text>
        </Text>
      </View>
    </View>
  );
}
