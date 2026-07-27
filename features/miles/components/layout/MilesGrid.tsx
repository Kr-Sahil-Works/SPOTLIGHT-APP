import { ScrollView } from "react-native";

import { milesCards } from "../../constants/cards";
import MilesCard from "../cards/MilesCard";

export default function MilesGrid() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 120,
      }}
    >
      {milesCards.map((item) => (
        <MilesCard
          key={item.id}
          item={item}
        />
      ))}
    </ScrollView>
  );
}