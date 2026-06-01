import { Image, ImageProps } from "expo-image";
import { memo } from "react";
import { View } from "react-native";

type Props = ImageProps & {
  uri?: string | null;
};

function AppImageComponent({
  uri,
  style,
  contentFit = "cover",
  transition = 120,
  source,
  ...props
}: Props) {
  if (!uri && !source) {
    return <View style={style} />;
  }

  return (
    <Image
      source={source || (uri ? { uri } : undefined)}
      style={style}
      contentFit={contentFit}
      cachePolicy="memory-disk"
      transition={transition}
      allowDownscaling
      recyclingKey={uri || String(source)}
      {...props}
    />
  );
}

export const AppImage = memo(AppImageComponent);