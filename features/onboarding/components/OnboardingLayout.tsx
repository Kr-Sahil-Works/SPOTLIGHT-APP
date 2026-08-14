import { ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MilesSpotAmbientBackground from "@/components/common/MilesSpotAmbientBackground";

import OnboardingButton from "./OnboardingButton";
import OnboardingProgress from "./OnboardingProgress";
import OnboardingWave from "./OnboardingWave";

type Props = {
  current: number;
  total: number;
  onNext: () => void;
  onPrevious?: () => void;
  children: ReactNode;
  buttonText?: string;
  showAmbientBackground?: boolean;
};

export default function OnboardingLayout({
  current,
  total,
  onNext,
  onPrevious,
  children,
  buttonText = "Continue",
  showAmbientBackground = true,
}: Props) {
  const { width } = useWindowDimensions();

  return (
    /*
     * IMPORTANT:
     *
     * This outer View fills the REAL entire screen.
     * Therefore the ambient background can extend
     * behind the Android status bar.
     */
    <View style={styles.root}>

      {/* =====================================================
          FULL-SCREEN BACKGROUND
      ===================================================== */}

      {showAmbientBackground && (
        <View
          pointerEvents="none"
          style={styles.backgroundLayer}
        >
          <MilesSpotAmbientBackground />
        </View>
      )}

      {/* =====================================================
          SAFE CONTENT AREA
          
          Content itself stays inside safe areas,
          but background stays behind everything.
      ===================================================== */}

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>

          {/* MAIN CONTENT */}
          <View style={styles.content}>
            {children}
          </View>

          {/* =================================================
              BOTTOM NAVIGATION
          ================================================= */}

          <View style={styles.bottomArea}>

            {/* Wave */}
            <View style={styles.waveContainer}>
              <OnboardingWave width={width} />
            </View>

            {/* Controls */}
            <View style={styles.controls}>

              {/* Previous */}
              <View style={styles.sideContainer}>
                {onPrevious ? (
                  <Pressable
                    onPress={onPrevious}
                    hitSlop={16}
                    style={({ pressed }) => [
                      styles.previousButton,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={styles.previousArrow}>
                      ←
                    </Text>
                  </Pressable>
                ) : null}
              </View>

              {/* Progress */}
              <View style={styles.progressContainer}>
                <OnboardingProgress
                  current={current}
                  total={total}
                />
              </View>

              {/* Next */}
              <View style={styles.buttonContainer}>
                <OnboardingButton
                  title={buttonText}
                  onPress={onNext}
                />
              </View>

            </View>
          </View>

        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({

  /* =========================================================
     FULL SCREEN ROOT
  ========================================================= */

  root: {
    flex: 1,

    backgroundColor: "transparent",

    overflow: "hidden",
  },

  /* =========================================================
     FULL SCREEN AMBIENT BACKGROUND
     
     This is intentionally outside SafeAreaView.
     
     Therefore it covers:
       status bar
       content
       bottom navigation
  ========================================================= */

  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,

    zIndex: 0,

    pointerEvents: "none",
  },

  /* =========================================================
     SAFE AREA
  ========================================================= */

  safeArea: {
    flex: 1,

    backgroundColor: "transparent",
  },

  /* =========================================================
     CONTAINER
  ========================================================= */

  container: {
    flex: 1,

    backgroundColor: "transparent",

    overflow: "hidden",
  },

  /* =========================================================
     CONTENT
  ========================================================= */

  content: {
    flex: 1,

    backgroundColor: "transparent",

    zIndex: 1,
  },

  /* =========================================================
     BOTTOM AREA
  ========================================================= */

  bottomArea: {
    width: "100%",

    backgroundColor: "transparent",

    zIndex: 2,
  },

  /* =========================================================
     WAVE
  ========================================================= */

  waveContainer: {
    width: "100%",

    backgroundColor: "transparent",
  },

  /* =========================================================
     CONTROLS
  ========================================================= */

  controls: {
    minHeight: 82,

    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    backgroundColor: "transparent",
  },

  /* =========================================================
     PREVIOUS
  ========================================================= */

  sideContainer: {
    width: 70,

    alignItems: "flex-start",

    backgroundColor: "transparent",
  },

  previousButton: {
    width: 44,
    height: 44,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "transparent",
  },

  previousArrow: {
    color: "#C29A38",

    fontSize: 26,

    fontWeight: "300",
  },

  /* =========================================================
     PROGRESS
  ========================================================= */

  progressContainer: {
    flex: 1,

    alignItems: "center",

    backgroundColor: "transparent",
  },

  /* =========================================================
     NEXT BUTTON
  ========================================================= */

  buttonContainer: {
    width: 135,

    alignItems: "flex-end",

    backgroundColor: "transparent",
  },

  pressed: {
    opacity: 0.55,
  },
});