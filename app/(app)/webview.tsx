import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
    ActivityIndicator,
    TouchableOpacity,
    View,
} from "react-native";
import { WebView } from "react-native-webview";

export default function WebViewScreen() {
  const { url } = useLocalSearchParams();
  const router = useRouter();

  const webRef = useRef<WebView>(null);

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // allow only github
  const isAllowedUrl = (u: string) => {
    return u.startsWith("https://github.com");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {/* HEADER */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* PROGRESS BAR */}
      {progress < 1 && (
        <View
          style={{
            height: 2,
            backgroundColor: "#111",
          }}
        >
          <View
            style={{
              height: 2,
              width: `${progress * 100}%`,
              backgroundColor: "#22c55e",
            }}
          />
        </View>
      )}

      {/* WEBVIEW */}
      <WebView
        ref={webRef}
        source={{ uri: String(url) }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onLoadProgress={({ nativeEvent }) =>
          setProgress(nativeEvent.progress)
        }
        pullToRefreshEnabled={true}
        
        // block external links
        onShouldStartLoadWithRequest={(request) => {
          if (isAllowedUrl(request.url)) return true;
          return false;
        }}

        // force all links inside same webview
        setSupportMultipleWindows={false}
      />

      {/* LOADING SPINNER */}
      {loading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#22c55e" />
        </View>
      )}
    </View>
  );
}