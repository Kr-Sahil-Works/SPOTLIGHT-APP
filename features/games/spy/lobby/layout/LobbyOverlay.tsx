import { BlurView } from "expo-blur";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  contentStyle?: object;
};

export default function LobbyOverlay({
  visible,
  onClose,
  children,
  contentStyle,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View
        style={styles.overlay}
      >
        {/* =========================
            BACKGROUND BLUR + DIM
        ========================= */}

        <Pressable
          style={styles.backdrop}
          onPress={onClose}
        >
          <BlurView
            intensity={25}
            tint="dark"
            experimentalBlurMethod="dimezisBlurView"
            style={StyleSheet.absoluteFill}
          />

          <View
            style={styles.dim}
          />
        </Pressable>

        {/* =========================
            FOREGROUND CONTENT
        ========================= */}

        <View
          style={[
            styles.content,
            contentStyle,
          ]}
          pointerEvents="box-none"
        >
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles =
  StyleSheet.create({
    overlay: {
      flex: 1,

      backgroundColor:
        "rgba(0,0,0,0.25)",

      position:
        "relative",
    },

    backdrop: {
      ...StyleSheet.absoluteFillObject,

      zIndex: 1,

      elevation: 1,
    },

    dim: {
      ...StyleSheet.absoluteFillObject,

      backgroundColor:
        "rgba(0,0,0,0.51)",

      zIndex: 2,

      elevation: 2,
    },

    content: {
      ...StyleSheet.absoluteFillObject,

      zIndex: 10,

      elevation: 10,
    },
  });