import GreenLoader from "@/components/GreenLoader";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles";
import { useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Animated, Image, Pressable, Text, View } from "react-native";

export default function Login(){

  const {startSSOFlow} = useSSO();
  const router = useRouter();

  const [loading,setLoading] = useState(false);

  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  // reset if user comes back
  useFocusEffect(
    useCallback(()=>{

      setLoading(false);

    },[])
  )

  const pressIn = ()=>{

    Animated.parallel([
      Animated.spring(scale,{
        toValue:0.96,
        speed:40,
        bounciness:4,
        useNativeDriver:true
      }),
      Animated.timing(opacity,{
        toValue:0.9,
        duration:80,
        useNativeDriver:true
      })
    ]).start()

  }

  const pressOut = ()=>{

    Animated.parallel([
      Animated.spring(scale,{
        toValue:1,
        speed:40,
        bounciness:6,
        useNativeDriver:true
      }),
      Animated.timing(opacity,{
        toValue:1,
        duration:80,
        useNativeDriver:true
      })
    ]).start()

  }

const handleGoogleSignIn = async () => {

  if (loading) return

  setLoading(true)

  setTimeout(() => {
    setLoading(false)
  }, 600)

  try {

    const { createdSessionId, setActive } = await startSSOFlow({
      strategy: "oauth_google"
    })

    if (setActive && createdSessionId) {
      await setActive({ session: createdSessionId })
    }

  } catch (error) {

    console.error("Auth Error:", error)
    setLoading(false)

  }

}

  return(

    <View style={styles.container}>

      {/* BRAND */}

      <View style={styles.brandSection}>

        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={32} color={COLORS.primary}/>
        </View>

        <Text style={styles.appName}>spotlight</Text>
        <Text style={styles.tagline}>don't miss anything</Text>

      </View>

      {/* IMAGE */}

      <View style={styles.illustrationContainer}>
        <Image
          source={require("../../assets/images/loginpage/login1.png")}
          style={styles.illustration}
          resizeMode="cover"
        />
      </View>

      {/* LOGIN */}

      <View style={styles.loginSection}>

        <Animated.View
          style={{
            transform:[{scale}],
            opacity
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
              {justifyContent:"center",alignItems:"center"}
            ]}
          >

            {loading ? (

              <GreenLoader/>

            ) : (

              <View style={{flexDirection:"row",alignItems:"center"}}>

                <View style={styles.googleIconContainer}>
                  <Ionicons name="logo-google" size={20} color={COLORS.surface}/>
                </View>

                <Text style={styles.googleButtonText}>
                  Continue with Google
                </Text>

              </View>

            )}

          </Pressable>

        </Animated.View>

        <Text style={styles.termsText}>
          By continuing, you agree to our Terms and Privacy Policy
        </Text>

      </View>

    </View>
  )
}