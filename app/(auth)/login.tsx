import GreenLoader from "@/components/loaders/GreenLoader";
import { COLORS } from "@/constants/theme";
import useNetwork from "@/hooks/useNetwork";
import { styles } from "@/styles/auth.styles";
import { useAuth, useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef, useState } from "react";
import { Animated, AppState, Pressable, Text, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {

  const isOnline = useNetwork();

  const { startSSOFlow } = useSSO();

  const [loading, setLoading] =
  useState(false);

const loginStartedRef =
  useRef(false);

  const appState = useRef(
  AppState.currentState
);

useEffect(() => {
  const sub =
    AppState.addEventListener(
      "change",
      (nextState) => {
        if (
          appState.current !==
            "active" &&
          nextState ===
            "active"
        ) {
          setLoading(false);
          resetMorph();
        }

        appState.current =
          nextState;
      }
    );

  return () =>
    sub.remove();
}, []);

  const images = [
  require("../../assets/images/loginpage/login1.webp"),
  require("../../assets/images/loginpage/login2.webp"),
  require("../../assets/images/loginpage/login3.webp"),
  require("../../assets/images/loginpage/login4.webp"),
  require("../../assets/images/loginpage/login5.webp"),
];

const [currentImage, setCurrentImage] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  }, 4200);

  return () => clearInterval(interval);
}, []);

  const pressScale = useRef(new Animated.Value(1)).current;
  const morph = useRef(new Animated.Value(0)).current;
  const sweep = useRef(new Animated.Value(-250)).current;

const router = useRouter();

const {
  isLoaded,
  isSignedIn,
} = useAuth();

useEffect(() => {
  if (
    isLoaded &&
    isSignedIn
  ) {
    router.replace("/(tabs)");
  }
}, [
  isLoaded,
  isSignedIn,
]);

  const pressIn = () => {
    Animated.spring(pressScale,{
      toValue:0.96,
      speed:40,
      bounciness:4,
      useNativeDriver:true
    }).start();
  };

  const pressOut = () => {
    Animated.spring(pressScale,{
      toValue:1,
      speed:40,
      bounciness:6,
      useNativeDriver:true
    }).start();
  };

  const runSweep = () => {

    sweep.setValue(-250);

    Animated.timing(sweep,{
      toValue:250,
      duration:450,
      useNativeDriver:true
    }).start();

  };

  const startMorph = () => {

    Animated.timing(morph,{
      toValue:1,
      duration:500,
      useNativeDriver:true
    }).start();

  };

  const resetMorph = () => {

    Animated.timing(morph,{
      toValue:0,
      duration:250,
      useNativeDriver:true
    }).start();

  };

const handleGoogleSignIn = async () => {

  if (
    isSignedIn
  ) {
    router.replace(
      "/(tabs)"
    );
    return;
  }

  if (loading) return;

  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

  runSweep();
startMorph();

loginStartedRef.current = true;

setLoading(true);

  try {

const {
  createdSessionId,
  setActive,
} = await startSSOFlow({
  strategy: "oauth_google",
  redirectUrl: AuthSession.makeRedirectUri({
    scheme: "spotlightapp",
    path: "sso-callback",
  }),
});

if (setActive && createdSessionId) {
  await setActive({
  session: createdSessionId,
});

loginStartedRef.current =
  false;
resetMorph();
setLoading(false);

  return;
}
  } catch (error: any) {

  loginStartedRef.current =
    false;
    console.error("OAuth error:", error);
    resetMorph();
    setLoading(false);
  }
};

  const textOpacity = morph.interpolate({
    inputRange:[0,1],
    outputRange:[1,0]
  });

  const loaderOpacity = morph.interpolate({
    inputRange:[0,1],
    outputRange:[0,1]
  });

  const scaleX = morph.interpolate({
    inputRange:[0,1],
    outputRange:[1,0.9]
  });

  return(

    <View style={styles.container}>

      <View style={styles.brandSection}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={32} color={COLORS.primary}/>
        </View>
        <Text style={styles.appName}>spotlight</Text>
        <Text style={styles.tagline}>don't miss anything</Text>
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
            transform:[
              {scale:pressScale},
              {scaleX}
            ]
          }}
        >

          <Pressable
            onPress={handleGoogleSignIn}
            onPressIn={pressIn}
            onPressOut={pressOut}
   disabled={
  loading ||
  !isOnline ||
  isSignedIn
}
            android_ripple={{color:"rgba(255,255,255,0.25)"}}
            style={[
              styles.googleButton,
              !isOnline && {
                opacity: 0.5,
              },
              {justifyContent:"center",alignItems:"center",overflow:"hidden"}
            ]}
          >
            <Animated.View
              style={{
                position:"absolute",
                width:250,
                height:"100%",
                transform:[{translateX:sweep}]
              }}
            >
              <LinearGradient
                colors={["transparent","rgba(255,255,255,0.25)","transparent"]}
                start={{x:0,y:0}}
                end={{x:1,y:0}}
                style={{flex:1}}
              />
            </Animated.View>

            <Animated.View
              style={{
                flexDirection:"row",
                alignItems:"center",
                opacity:textOpacity
              }}
            >

              <View style={styles.googleIconContainer}>
                <Ionicons name="logo-google" size={20} color={COLORS.surface}/>
              </View>

              <Text style={styles.googleButtonText}>
                Continue with Google
              </Text>

            </Animated.View>

            <Animated.View
              style={{
                position:"absolute",
                opacity:loaderOpacity
              }}
            >
              <GreenLoader/>
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
    Internet connection required to sign in
  </Text>
)}
        </Animated.View>

   <Text style={styles.termsText}>
  By continuing, you agree to our{" "}

  <Text
    style={{
      color: "#22c55e",
      textDecorationLine: "underline",
      fontWeight: "700",
    }}
    onPress={() =>
      router.push("/policy/terms-and-conditions")
    }
  >
    Terms
  </Text>

  {" "}and{" "}

  <Text
    style={{
      color: "#22c55e",
      textDecorationLine: "underline",
      fontWeight: "700",
    }}
    onPress={() =>
      router.push("/policy/privacy-policy")
    }
  >
    Privacy Policy
  </Text>
</Text>

      </View>

    </View>

  );

}