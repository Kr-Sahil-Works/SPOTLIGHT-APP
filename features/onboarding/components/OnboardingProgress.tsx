import { View } from "react-native";

type Props = {
  current: number;
  total: number;
};

export default function OnboardingProgress({
  current,
  total,
}: Props) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
      }}
    >
      {Array.from({ length: total }).map((_, index) => {
        const active = index === current;

        return (
          <View
            key={index}
            style={{
              width: active ? 16 : 6,
              height: 4,
              borderRadius: 4,
              backgroundColor: active
                ? "#F4C95D"
                : "#4A412C",
              opacity: active ? 1 : 0.7,
            }}
          />
        );
      })}
    </View>
  );
}