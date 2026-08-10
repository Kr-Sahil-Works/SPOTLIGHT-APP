import AdvancedSeatLayout from "../player/AdvancedSeatLayout";
import DefaultSeatLayout from "../player/DefaultSeatLayout";

import { LobbyPlayer } from "../../types/player";

type Props = {
  players: LobbyPlayer[];
  advancedRoom?: boolean;
  votingStarted?: boolean;
};

export default function LobbyPlayersSection({
  players,
  advancedRoom = false,
  votingStarted = false,
}: Props) {
  const visiblePlayers = players.slice(0, 8);

  if (advancedRoom) {
    return (
      <AdvancedSeatLayout
        players={visiblePlayers}
      />
    );
  }

  return (
    <DefaultSeatLayout
      players={visiblePlayers}
    />
  );
}