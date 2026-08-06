import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import PinDots from "@/shared/components/ui/PinDots";
import PinKeypad from "@/shared/components/ui/PinKeypad";

import joinSpy from "@/assets/images/games/spy/mascot/join_spy.webp";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function JoinRoomModal({
  visible,
  onClose,
}: Props) {
  const [pin, setPin] = useState("");
  const [success, setSuccess] = useState(false);

  const handleNumber = (digit: string) => {
    if (pin.length >= 4) return;

    const nextPin = pin + digit;

    setPin(nextPin);

    if (nextPin.length === 4) {
      mascotLook.value = withTiming(-5, {
  duration: 100,
});

setTimeout(() => {
  mascotLook.value = withTiming(0, {
    duration: 100,
  });
}, 120);
      setSuccess(true);

setTimeout(() => {
  setSuccess(false);
}, 120);
    }
  };

const overlayOpacity = useSharedValue(0);
const cardScale = useSharedValue(0.92);
const cardOpacity = useSharedValue(0);

const keypadScale = useSharedValue(1);
const keypadOpacity = useSharedValue(1);

const mascotScale = useSharedValue(0.7);
const mascotOpacity = useSharedValue(0);
const mascotLook = useSharedValue(0);

useEffect(() => {
  if (visible) {
   overlayOpacity.value = withTiming(1, {
  duration: 180,
});

cardOpacity.value = withTiming(1, {
  duration: 220,
});

cardScale.value = withTiming(1, {
  duration: 220,
  easing: Easing.out(Easing.cubic),
});

keypadOpacity.value = withTiming(1, {
  duration: 180,
});

keypadScale.value = withTiming(1, {
  duration: 180,
});

mascotOpacity.value = withTiming(1, {
  duration: 140,
});

mascotScale.value = withTiming(1, {
  duration: 260,
  easing: Easing.out(Easing.back(1.8)),
});

  } else {
    cardOpacity.value = 0;
    cardScale.value = 0.92;
    keypadScale.value = 1;
    keypadOpacity.value = 1;
    mascotOpacity.value = 0;
    mascotScale.value = 0.7;
    overlayOpacity.value = 0;
  }
}, [visible]);

const keypadAnimatedStyle =
  useAnimatedStyle(() => ({
    opacity: keypadOpacity.value,

    transform: [
      {
        scale: keypadScale.value,
      },
    ],
  }));


const cardAnimatedStyle =
  useAnimatedStyle(() => ({
    opacity: cardOpacity.value,

    transform: [
      {
        scale: cardScale.value,
      },
    ],
  }));

const mascotAnimatedStyle =
  useAnimatedStyle(() => ({
    opacity: mascotOpacity.value,

    transform: [
      {
        translateY: mascotLook.value,
      },
      {
        scale: mascotScale.value,
      },
    ],
  }));

const overlayAnimatedStyle =
  useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

const closeModal = () => {
  mascotOpacity.value = withTiming(0, {
    duration: 100,
  });

  cardScale.value = withTiming(0.97, {
    duration: 140,
  });

  cardOpacity.value = withTiming(0, {
    duration: 140,
  });

  keypadOpacity.value = withTiming(0.85, {
    duration: 120,
  });

  overlayOpacity.value = withTiming(0, {
    duration: 160,
  });

 setTimeout(() => {
  setPin("");
  setSuccess(false);

  onClose();
}, 150);
};
  
  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

 return (
  <Modal
    visible={visible}
    transparent
    animationType="none"
    statusBarTranslucent
    onRequestClose={closeModal}
  >
    <SafeAreaView
      style={styles.container}
      edges={["left", "right", "bottom"]}
    >
      {/* Tap outside to close */}
<Animated.View
  pointerEvents="box-none"
  style={[
    styles.overlay,
    overlayAnimatedStyle,
  ]}
>
  <Pressable
    style={StyleSheet.absoluteFill}
    onPress={closeModal}
  />
</Animated.View>

      {/* Modal */}
<View style={styles.cardBackdrop} />
      <View style={styles.modalContainer}>

        {/* Floating Mascot */}

      <Animated.View
  style={[
    styles.cardArea,
    cardAnimatedStyle,
  ]}
>

  {/* Floating Mascot */}

<Animated.View style={[styles.spyContainer, mascotAnimatedStyle]}>
  <Image
    source={joinSpy}
    style={styles.spy}
    contentFit="contain"
  />
</Animated.View>

  {/* Card */}

  <View style={styles.pinCard}>

    <Text style={styles.title}>
      ENTER ROOM PIN
    </Text>

    
<PinDots
  length={pin.length}
  success={success}
/>

  </View>

</Animated.View>

        {/* Keypad */}

        <Animated.View
  style={[
    styles.keypadContainer,
    keypadAnimatedStyle,
  ]}
>
          <PinKeypad
            onNumberPress={handleNumber}
            onBackspace={handleBackspace}
            onClose={closeModal}
          />
        </Animated.View>

      </View>
    </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
    container: {
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.67)",
  justifyContent: "space-between",

  alignItems: "center",
},

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

modalContainer: {
  flex: 1,

  width: "100%",

  justifyContent: "flex-end",

  alignItems: "center",
},

cardArea: {
  width: "100%",

  alignItems: "center",

  position: "absolute",

  top: 180,

  left: 0,
  right: 0,

  zIndex: 20,
},


pinCard: {
  width: "65%",

 height:145,

  backgroundColor: "#0a0909",

  borderRadius: 24,

  borderWidth: 1,
  borderColor: "#2D2D2D",

  alignItems: "center",
  justifyContent: "flex-end",

  paddingTop: 46,
  paddingBottom: 20 ,

  shadowColor: "#000",

  shadowOpacity: 0.30,

  shadowRadius: 16,

  shadowOffset: {
    width: 0,
    height: 8,
  },

  elevation: 12,
},


spyContainer: {
  position: "absolute",
  top: -82,
  zIndex: 50,
},

  spy: {
  width: 120,
  height: 120,
},

  title: {
    color: "#F5F5F5",

    fontSize: 16,

    fontWeight: "800",

    letterSpacing: 1,

    marginBottom: 18,
  },


cardBackdrop: {
  position: "absolute",

  top: 0,

  width: "100%",

  height: 330,

  backgroundColor: "#000000c5",
},
  

keypadContainer: {
  width: "100%",

  alignSelf: "stretch",

  marginTop: "auto",

  backgroundColor: "#141414",

  borderTopWidth:1.5,
  borderTopColor: "#ffffff1a",
  borderColor: "#2A2A2A",
},

});