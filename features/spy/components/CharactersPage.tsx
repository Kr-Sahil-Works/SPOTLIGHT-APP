import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { CHARACTERS } from "../constants/rules";

export default function CharactersPage() {
  return (
    <View style={styles.container}>
      {CHARACTERS.map((character) => (
        <View
          key={character.id}
          style={styles.card}
        >
          <Image
            source={character.image}
            style={styles.image}
            contentFit="contain"
          />

          <View style={styles.info}>
            <Text style={styles.name}>
              {character.name}
            </Text>

            <Text style={styles.goal}>
              Goal
            </Text>

            <Text style={styles.goalText}>
              {character.goal}
            </Text>

            <Text style={styles.description}>
              {character.description}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
container: {
  paddingTop: 10,
},


card: {
  flexDirection: "row",

  alignItems: "center",

  paddingVertical:2,

  marginBottom: 2,

  borderBottomWidth: 1,
  borderBottomColor: "#1C1C1C",
},

image: {
  width: 64,
  height: 64,

  marginRight: 14,
},

  info: {
    flex: 1,
  },

name: {
  color: "#FFF",

  fontSize: 16,

  fontWeight: "800",

  marginBottom: 4,
},

goal: {
  color: "#F2A900",

  marginTop: 4,

  fontSize: 11,

  fontWeight: "900",

  letterSpacing: 1,
},

goalText: {
  color: "#FFF",

  fontSize: 16,

  fontWeight: "800",

  marginTop: 2,
},

description: {
  color: "#b7b7b3",

  fontSize: 13,

  lineHeight: 18,
},
});