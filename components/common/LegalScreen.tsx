import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef } from "react";
import {
  Animated,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Section = {
  title: string;
  content: string;
};

type Props = {
  title: string;
  updated: string;
  sections: Section[];
};

export default function LegalScreen({
  title,
  updated,
  sections,
}: Props) {
  const router = useRouter();

  const scrollY =
  useRef(
    new Animated.Value(0)
  ).current;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
      }}
    >
      {/* HEADER */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingTop: 10,
          marginBottom: 24,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 46,
            height: 46,
            borderRadius: 23,
        backgroundColor:
  "rgba(34,197,94,0.10)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#fff"
          />
        </TouchableOpacity>

        <Text
          style={{
            color: "#eafff3",
          fontSize: 18,
fontWeight: "800",
marginBottom: 10,
  marginLeft:20,
          }}
        >
          {title}
        </Text>

    <View
  style={{
    flex: 1,

    height: 4,

    marginLeft: 16,

    borderRadius: 999,

    overflow: "hidden",

    backgroundColor:
      "rgba(34,197,94,0.10)",
  }}
>
  <Animated.View
    style={{
      height: "100%",

      borderRadius: 999,

      backgroundColor:
        "#22c55e",

      width:
        scrollY.interpolate({
          inputRange: [
            0,
            1500,
          ],

          outputRange: [
            "0%",
            "100%",
          ],

          extrapolate:
            "clamp",
        }),
    }}
  />
</View>
      </View>

     <Animated.ScrollView
     onScroll={Animated.event(
  [
    {
      nativeEvent: {
        contentOffset: {
          y: scrollY,
        },
      },
    },
  ],
  {
    useNativeDriver:
      false,
  }
)}
scrollEventThrottle={16}
  showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "#06110A",
            borderRadius: 28,
            borderWidth: 1,
           borderColor:
  "rgba(34,197,94,0.15)",
            padding: 24,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 22,
              fontWeight: "800",
            }}
          >
            {title}
          </Text>

          <Text
            style={{
              color: "#8b8b8b",
              marginTop: 10,
              marginBottom: 28,
              fontSize: 12,
            }}
          >
            Last Updated {updated}
          </Text>

          <View
  style={{
    backgroundColor:
      "rgba(34,197,94,0.08)",

    borderWidth: 1,

    borderColor:
      "rgba(34,197,94,0.18)",

    borderRadius: 20,

    padding: 16,

    marginBottom: 30,
  }}
>
  <Text
    style={{
      color: "#22c55e",
      fontSize: 16,
      fontWeight: "800",
      marginBottom: 10,
    }}
  >
    Spotlight Promise
  </Text>

  <Text
    style={{
      color: "#d8ffe8",
      fontSize: 14,
      lineHeight: 24,
    }}
  >
    ✓ 100% Ads-Free, Forever Zero Ads {"\n"}
    ✓ 100% All Features, Always Free {"\n"}
    ✓ No selling of user data{"\n"}
    ✓ No third-party data brokers{"\n"}
    ✓ No advertising profiles{"\n"}
    ✓ Privacy-first Secure Architecture{"\n"}
    ✓ Built Independently, Funded by Trust & Feedbacks of Users : )
  </Text>
</View>



          {sections.map(
            (section, index) => (
              <View
                key={index}
                style={{
                  marginBottom: 28,
                }}
              >
                <Text
                  style={{
                    color: "#22c55e",
                    fontSize: 24,
                    fontWeight: "800",
                    marginBottom: 12,
                  }}
                >
                  {index + 1}. {section.title}
                </Text>

                <Text
                  style={{
                    color: "#d8ffe8",
       lineHeight: 24,
fontSize: 14,
                  }}
                >
                  {section.content}
                </Text>
              </View>

              
            )
          )}
                    <View
  style={{
    marginBottom: 28,
  }}
>
  <Text
    style={{
      color: "#22c55e",
      fontSize: 20,
      fontWeight: "800",
      marginBottom: 10,
    }}
  >
    Contact
  </Text>

  <Text
    style={{
      color: "#d8ffe8",
      lineHeight: 24,
      fontSize: 14,
      marginBottom: 10,
    }}
  >
    Questions, suggestions, feature requests and bug reports are always welcome, feel free to contact  :  )
  </Text>

  <TouchableOpacity
    onPress={async () => {
      const phone = "+919608540597";

      const whatsappUrl =
        `whatsapp://send?phone=${phone}`;

      const dialerUrl =
        `tel:${phone}`;

      const supported =
        await Linking.canOpenURL(
          whatsappUrl
        );

      if (supported) {
        await Linking.openURL(
          whatsappUrl
        );
      } else {
        await Linking.openURL(
          dialerUrl
        );
      }
    }}
  >
    <Text
      style={{
        color: "#22c55e",
        textDecorationLine:
          "underline",
        fontSize: 14,
        fontWeight: "700",
      }}
    >
      +91 96085 40597
    </Text>
  </TouchableOpacity>
</View>
        </View>
        
    </Animated.ScrollView>
    </View>
    
  );
}