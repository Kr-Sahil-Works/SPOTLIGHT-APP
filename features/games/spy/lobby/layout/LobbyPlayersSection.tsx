import AdvancedSeatLayout from "../player/AdvancedSeatLayout";

import DefaultSeatLayout from "../player/DefaultSeatLayout";

import { LobbyPlayer } from "../../types/player";

type Props = {
  players: LobbyPlayer[];

  maxPlayers?: number;

  advancedRoom?: boolean;

  votingStarted?: boolean;

  currentSpeakerUserId?: string;

  isPlaying?: boolean;

  currentPlayerId?: string;

  hasVoted?: boolean;

  allOtherPlayersReady?: boolean;

  onVote?: (
    playerId: string
  ) => void;

  onSkipVote?: () => void;
};

export default function LobbyPlayersSection({
  players,
  maxPlayers = 4,
  advancedRoom = false,
  votingStarted = false,
  currentSpeakerUserId,
  isPlaying = false,
  currentPlayerId,
  hasVoted = false,
  allOtherPlayersReady = false,
  onVote,
  onSkipVote,
}: Props) {
  const safeMaxPlayers =
    Math.min(
      Math.max(maxPlayers, 4),
      8
    );

  if (advancedRoom) {
    return (
      <AdvancedSeatLayout
  players={players}
        maxPlayers={
          safeMaxPlayers
        }
        isPlaying={
          isPlaying
        }
        currentSpeakerUserId={
          currentSpeakerUserId
        }
      />
    );
  }

  return (
    <DefaultSeatLayout
  players={players}
  maxPlayers={safeMaxPlayers}
  isPlaying={isPlaying}
  votingStarted={votingStarted}
  currentSpeakerUserId={
    currentSpeakerUserId
  }
  currentPlayerId={
    currentPlayerId
  }
  hasVoted={
    hasVoted
  }
  onVote={
    onVote
  }
  onSkipVote={
    onSkipVote
  }
  allOtherPlayersReady={
  allOtherPlayersReady
}
/>
  );
}