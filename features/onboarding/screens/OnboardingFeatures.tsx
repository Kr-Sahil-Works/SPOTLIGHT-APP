import { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from "react-native";

import OnboardingLayout from "../components/OnboardingLayout";

type Props = {
  onNext: () => void;
  onPrevious: () => void;
};

const FEATURES = [
  {
    icon: "✦",
    title: "Chat & Themes",
    subtitle: "Make every conversation yours",
  },
  {
    icon: "◎",
    title: "Share Stories",
    subtitle: "Share your Moments",
  },
  {
    icon: "✎",
    title: "Notes & Memories",
    subtitle: "Keep the little things close",
  },
  {
    icon: "◇",
    title: "Collections",
    subtitle: "Save what matters",
  },
];

export default function OnboardingFeatures({
  onNext,
  onPrevious,
}: Props) {
  const animations = useRef(
    FEATURES.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(16),
    }))
  ).current;

  useEffect(() => {
    Animated.stagger(
      90,
      animations.map((animation) =>
        Animated.parallel([
          Animated.timing(animation.opacity, {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }),

          Animated.timing(animation.translateY, {
            toValue: 0,
            duration: 420,
            useNativeDriver: true,
          }),
        ])
      )
    ).start();
  }, []);

  return (
    <OnboardingLayout
      current={1}
      total={3}
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <View style={styles.container}>

       

        {/* Centered feature group */}
        <View style={styles.featureArea}>
           {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>
            YOUR MILESSPOT
          </Text>

          <Text style={styles.title}>
Meet your new Spot {"\n"} with features like
          </Text>
        </View>
          <View style={styles.cards}>
            {FEATURES.map((feature, index) => {
              const animation =
                animations[index];

              return (
                <Animated.View
                  key={feature.title}
                  style={[
                    styles.card,
                    {
                      opacity:
                        animation.opacity,

                      transform: [
                        {
                          translateY:
                            animation.translateY,
                        },
                      ],
                    },
                  ]}
                >
                  <View style={styles.iconContainer}>
                    <Text style={styles.icon}>
                      {feature.icon}
                    </Text>
                  </View>

                  <View style={styles.cardText}>
                    <Text style={styles.cardTitle}>
                      {feature.title}
                    </Text>

                    <Text
                      style={styles.cardSubtitle}
                    >
                      {feature.subtitle}
                    </Text>
                  </View>
                </Animated.View>
              );
            })}
          </View>
        </View>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingHorizontal: 20,
  },

  header: {
    alignItems: "center",

    paddingTop: 38,
    paddingBottom:40,
  },

  eyebrow: {
    color: "#A68A43",

    fontSize: 11,
    fontWeight: "700",

    letterSpacing: 3,

    marginBottom: 7,
  },

  title: {
    color: "#F5F2EA",

    fontSize: 34,
    lineHeight: 42,

    fontWeight: "900",

    letterSpacing: -1.2,

    textAlign: "center",
  },

  featureArea: {
    flex: 1,

    justifyContent: "center",

    paddingBottom: 18,
  },

  cards: {
    width: "100%",

    gap: 9,
  },

  card: {
    width: "100%",

    minHeight: 78,

    borderRadius: 16,

    borderWidth: 1,
    borderColor: "#292315",

    backgroundColor: "#0D0C09",

    paddingHorizontal: 14,
    paddingVertical: 11,

    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 50,
    height: 50,

    borderRadius: 14,

    backgroundColor: "#17130A",

    borderWidth: 1,
    borderColor: "#3B3018",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 14,
  },

  icon: {
    color: "#F4C95D",

    fontSize: 23,

    fontWeight: "600",
  },

  cardText: {
    flex: 1,
  },

  cardTitle: {
    color: "#F1EBDD",

    fontSize: 16,
    fontWeight: "700",

    marginBottom: 3,
  },

  cardSubtitle: {
    color: "#777268",

    fontSize: 12.5,
    lineHeight: 17,

    fontWeight: "500",
  },
});