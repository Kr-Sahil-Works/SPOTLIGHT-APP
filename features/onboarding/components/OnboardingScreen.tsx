import { ReactNode } from "react";
import {
    SafeAreaView,
    Text,
    View,
} from "react-native";

import OnboardingButton from "./OnboardingButton";
import OnboardingProgress from "./OnboardingProgress";

type Props = {
  current: number;
  total: number;
  title: string;
  description: string;
  onNext: () => void;
  buttonText: string;
  children?: ReactNode;
};

export default function OnboardingScreen({
  current,
  total,
  title,
  description,
  onNext,
  buttonText,
  children,
}: Props) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#000",
      }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: 24,
        }}
      >
        <OnboardingProgress
          current={current}
          total={total}
        />

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {children}

          <Text
            style={{
              color: "#fff",
              fontSize: 30,
              fontWeight: "800",
              textAlign: "center",
              marginTop: 28,
            }}
          >
            {title}
          </Text>

          <Text
            style={{
              color: "#888",
              fontSize: 16,
              lineHeight: 24,
              textAlign: "center",
              marginTop: 12,
              maxWidth: 340,
            }}
          >
            {description}
          </Text>
        </View>

        <OnboardingButton
          title={buttonText}
          onPress={onNext}
        />
      </View>
    </SafeAreaView>
  );
}