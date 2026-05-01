import GreenLoader from "@/components/GreenLoader";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles";
import { useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useRef, useState } from "react";
import { Animated, Image, Pressable, Text, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();
const redirectUrl = AuthSession.makeRedirectUri();

export default function Login() {

  const { startSSOFlow } = useSSO();

  const [loading,setLoading] = useState(false);

  const pressScale = useRef(new Animated.Value(1)).current;
  const morph = useRef(new Animated.Value(0)).current;
  const sweep = useRef(new Animated.Value(-250)).current;

const router = useRouter();

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
      duration:300,
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
  if (loading) return;

  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

  runSweep();
  startMorph();
  setLoading(true);

  try {
    const { createdSessionId, setActive, signIn } =
      await startSSOFlow({
        strategy: "oauth_google",
      });

    // 🔥 IMPORTANT: trigger external auth if needed
    if (signIn?.firstFactorVerification?.externalVerificationRedirectURL) {
      await WebBrowser.openAuthSessionAsync(
        signIn.firstFactorVerification.externalVerificationRedirectURL.toString(),
        "spotlightapp://"
      );
    }
if (setActive && createdSessionId) {
  await setActive({ session: createdSessionId });
resetMorph();
setLoading(false);
  // small delay avoids race condition
  setTimeout(() => {
    router.replace("/");
  }, 100);

  return;
}
  } catch (error: any) {
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
  source={require("../../assets/images/loginpage/login1.png")}
  style={styles.illustration}
  resizeMode="cover"
  fadeDuration={0}   // 👈 prevents bitmap issue
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
            disabled={loading}
            android_ripple={{color:"rgba(255,255,255,0.25)"}}
            style={[
              styles.googleButton,
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

        </Animated.View>

        <Text style={styles.termsText}>
          By continuing, you agree to our Terms and Privacy Policy
        </Text>

      </View>

    </View>

  );

}