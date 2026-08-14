import {
    KeyboardStickyView,
} from "react-native-keyboard-controller";

import type { ReactNode } from "react";
import {
    StyleSheet,
    type StyleProp,
    type ViewStyle,
} from "react-native";

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  offset?: number;
};

export default function KeyboardComposer({
  children,
  style,
  offset = 0,
}: Props) {
  return (
    <KeyboardStickyView
      offset={{
        closed: 0,
        opened: offset,
      }}
      style={[
        styles.container,
        style,
      ]}
    >
      {children}
    </KeyboardStickyView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});