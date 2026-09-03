import { Image } from "expo-image";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import LobbyBottomBar from "@/features/games/spy/lobby/layout/LobbyBottomBar";
import LobbyChat from "@/features/games/spy/lobby/layout/LobbyChat";
import LobbyHeader from "@/features/games/spy/lobby/layout/LobbyHeader";
import LobbyInfoPanel from "@/features/games/spy/lobby/layout/LobbyInfoPanel";
import LobbyPlayersSection from "@/features/games/spy/lobby/layout/LobbyPlayersSection";

import LobbyChatInput from "@/features/games/spy/lobby/chat/LobbyChatInput";
import LobbyBackground from "@/features/games/spy/lobby/layout/LobbyBackground";
import { LobbyChatMessage } from "@/features/games/spy/types/chat";
import KeyboardComposer from "@/shared/keyboard/KeyboardComposer";

import { useLocalSearchParams } from "expo-router";

import { useLobby } from "@/features/games/spy/lobby/hooks/useLobby";
import { useLobbyPlayers } from "@/features/games/spy/lobby/hooks/useLobbyPlayers";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";

import RoundIntroCard from "@/features/games/spy/components/RoundIntroCard";
import CategorySelection from "@/features/games/spy/game/CategorySelection";
import PrivateWordReveal from "@/features/games/spy/game/PrivateWordReveal";
import VotingResultCard from "@/features/games/spy/game/VotingResultCard";
import LobbyOverlay from "@/features/games/spy/lobby/layout/LobbyOverlay";
import LobbyTurnIndicator from "@/features/games/spy/lobby/layout/LobbyTurnIndicator";

const MOCK_MESSAGES: LobbyChatMessage[] = [
  {
    id: "1",
    type: "system",
    message: "Alex joined the room",
    createdAt: Date.now(),
  },
  {
    id: "2",
    type: "user",
    sender: "Silent Hero",
    message: "Welcome everyone 👋",
    createdAt: Date.now(),
  },
  {
    id: "3",
    type: "user",
    sender: "Emma",
    message: "Ready!",
    createdAt: Date.now(),
  },
  {
    id: "4",
    type: "user",
    sender: "Emma",
    message: "Alex joined the room",
    createdAt: Date.now(),
  },
  {
    id: "5",
    type: "user",
    sender: "PP the Tp",
    message: "Welcome everyone 👋",
    createdAt: Date.now(),
  },
  {
    id: "6",
    type: "user",
    sender: "Emma",
    message: "Ready!",
    createdAt: Date.now(),
  },
  {
    id: "7",
    type: "system",
    message: "Priya exited the room",
    createdAt: Date.now(),
  },
  {
    id: "8",
    type: "user",
    sender: "Silent Hero",
    message: "Welcome everyone 👋",
    createdAt: Date.now(),
  },
  {
    id: "9",
    type: "user",
    sender: "Emma",
    message: "Ready!",
    createdAt: Date.now(),
  },
];

const DEMO_GAME_STARTED = false;

export default function LobbyScreen() {
  const { width, height } = useWindowDimensions();

const [chatOpen, setChatOpen] =
  useState(false);

const [secretReady, setSecretReady] =
  useState(false);

const [
  secretRevealEndsAt,
  setSecretRevealEndsAt,
] =
  useState<number | null>(null);

  const scale = Math.min(
    Math.max(width / 390, 0.84),
    1.08
  );


  const isShortScreen = height < 760;

  const playerAreaHeight = isShortScreen
    ? 380
    : 395;

 
    

const { roomId } =
  useLocalSearchParams<{
    roomId?: string;
  }>();

const validRoomId = roomId
  ? (roomId as Id<"gameRooms">)
  : undefined;

const {
  room,
  isLoading: roomLoading,
} = useLobby(roomId);

const {
  players,
  isLoading: playersLoading,
} = useLobbyPlayers(roomId);

const devRestartClassicGame = useMutation(
  api.games.spy.classic.game.devRestartClassicGame
);

const currentPlayer =
  useQuery(
    api.games.spy.rooms.getCurrentPlayer,
    validRoomId
      ? {
          roomId: validRoomId,
        }
      : "skip"
  );


 const otherPlayers =
  players.filter(
    (player) =>
      player.userId !==
      currentPlayer?.userId
  );

const allOtherPlayersReady =
  otherPlayers.length > 0 &&
  otherPlayers.every(
    (player) => player.isReady
  );
    
     /*
 * =========================
 * 💬 RESPONSIVE CHAT HEIGHT
 * =========================
 *
 * Chat should grow with the screen,
 * but never become excessively tall.
 */
const chatHeight = Math.min(
  Math.max(
    height *
      (room?.status === "playing"
        ? 0.32
        : 0.32),
    240
  ),
  480
);



/* =========================
   🎮 CLASSIC GAME STATE
========================= */
const classicGame =
  useQuery(
    api.games.spy.classic.uiQueries
      .getClassicGameState,
    validRoomId
      ? {
          roomId:
            validRoomId,
        }
      : "skip"
  );

  const setPlayerReady = useMutation(
  api.games.spy.rooms.setPlayerReady
);

const startGame = useMutation(
  api.games.spy.rooms.startGame
);

const allPlayersReady =
  players.length >= 4 &&
  players.length <= (room?.maxPlayers ?? 4) &&
  players.every(
    (player) => player.isReady
  );

const canStartGame =
  currentPlayer?.isHost === true &&
  room?.status === "lobby" &&
  allPlayersReady;

const handleReady = async () => {
  if (!validRoomId || !currentPlayer) {
    return;
  }

  try {
    await setPlayerReady({
      roomId: validRoomId,
      isReady: !currentPlayer.isReady,
    });
  } catch (error) {
    console.error(
      "READY ERROR:",
      error
    );
  }
};

const handleStartGame = async () => {
  if (!validRoomId) {
    return;
  }

  if (!currentPlayer?.isHost) {
    return;
  }

  if (!canStartGame) {
    return;
  }

  try {
    const result = await startGame({
      roomId: validRoomId,
    });

    if (!result.success) {
      console.log(
        "START GAME REJECTED:",
        result.reason
      );

      return;
    }

    console.log(
      "GAME STARTED:",
      result
    );
  } catch (error) {
    console.error(
      "START GAME ERROR:",
      error
    );
  }
};



const votingResult =
  useQuery(
    api.games.spy.classic.roundVoting
      .getRoundVotingResult,

    classicGame?.round?.roundId
      ? {
          roundId:
            classicGame.round.roundId,
        }
      : "skip"
  );

  
  const [
  showVotingResult,
  setShowVotingResult,
] = useState(false);

const [
  showVotingRole,
  setShowVotingRole,
] = useState(false);

const [
  displayVotingResult,
  setDisplayVotingResult,
] =
  useState<typeof votingResult | null>(
    null
  );

  /* =========================
   🏁 FINALIZE ROUND VOTING
========================= */

const finalizeRoundVoting =
  useMutation(
    api.games.spy.classic.roundVoting
      .finalizeRoundVoting
  );

  const processRoundResult =
  useMutation(
    api.games.spy.classic.result
      .processRoundResult
  );

const shownResultRoundRef =
  useRef<string | null>(null);

useEffect(() => {
  const roundId =
    classicGame?.round?.roundId;

  if (
    classicGame?.round?.phase !==
      "result" ||
    !roundId ||
    !votingResult
  ) {
    return;
  }

  if (
    shownResultRoundRef.current ===
    roundId
  ) {
    return;
  }

  shownResultRoundRef.current =
    roundId;

  setDisplayVotingResult(
    votingResult
  );

  setShowVotingRole(false);
  setShowVotingResult(true);
}, [
  classicGame?.round?.phase,
  classicGame?.round?.roundId,
  votingResult?.roundId,
]);



// useEffect(() => {
//   if (!showVotingResult) {
//     return;
//   }

//   setShowVotingRole(false);

//   const roleTimer =
//     setTimeout(() => {
//       setShowVotingRole(true);
//     }, 2500);

//   return () => {
//     clearTimeout(roleTimer);
//   };
// }, [showVotingResult]);

useEffect(() => {
  if (!showVotingResult) {
    return;
  }

  const roleTimer = setTimeout(() => {
    setShowVotingRole(true);
  }, 2500);

  const hideResultTimer = setTimeout(() => {
    setShowVotingResult(false);
    setShowVotingRole(false);
  }, 5000);

  return () => {
    clearTimeout(roleTimer);
    clearTimeout(hideResultTimer);
  };
}, [showVotingResult]);

useEffect(() => {
  const roundId =
    classicGame?.round?.roundId;

 if (
  !currentPlayer?.isHost ||
  classicGame?.round?.phase !== "result" ||
  !roundId ||
  !votingResult ||
  !validRoomId
) {
  return;
}

  let cancelled = false;

  const processResult = async () => {
    try {
      /*
       * Wait for the result card + role reveal
       * to finish before processing the round.
       */
      await new Promise((resolve) =>
        setTimeout(resolve, 3200)
      );

      if (cancelled) {
        return;
      }

      const result =
        await processRoundResult({
          roundId,
        });

      if (cancelled) {
        return;
      }
    } catch (error) {
      if (!cancelled) {
        console.error(
          "PROCESS ROUND RESULT ERROR:",
          error
        );
      }
    }
  };

  processResult();

  return () => {
    cancelled = true;
  };
}, [
  currentPlayer?.isHost,
  classicGame?.round?.phase,
  classicGame?.round?.roundId,
  votingResult,
  validRoomId,
  processRoundResult,
]);


/* =========================
   🗳️ CATEGORY VOTE
========================= */

const castCategoryVote =
  useMutation(
    api.games.spy.classic.categorySelection
      .castCategoryVote
  );

/* =========================
   🏁 FINALIZE CATEGORY
========================= */

const finalizeCategorySelection =
  useMutation(
    api.games.spy.classic.categorySelection
      .finalizeCategorySelection
  );

  /* =========================
   🎤 CLASSIC TURN ADVANCE
========================= */
const advanceClassicTurn =
  useMutation(
    api.games.spy.classic.turns
      .advanceClassicTurn
  );

  const handleSkipTurn = async () => {
  if (
    !classicGame?.round?.roundId ||
    !currentPlayer
  ) {
    return;
  }

  if (
    classicGame.round.phase !==
    "speaking"
  ) {
    return;
  }

const currentSpeakerId =
  classicGame.round.speakerOrder[
    classicGame.round.currentSpeakerIndex
  ];

if (
  currentSpeakerId !==
  currentPlayer.playerId
) {
  return;
}

  try {
await advanceClassicTurn({
  roundId:
    classicGame.round.roundId,

  force: true,
});
  } catch (error) {
    console.error(
      "SKIP TURN ERROR:",
      error
    );
  }
};

const castRoundVote =
  useMutation(
    api.games.spy.classic.roundVoting
      .castRoundVote
  );

const myRoundVote =
  useQuery(
    api.games.spy.classic.roundVoting
      .getMyRoundVote,
    classicGame?.round?.phase === "voting" ||
classicGame?.round?.phase === "tieBreak"
      ? {
          roundId:
            classicGame.round.roundId,
        }
      : "skip"
  );

const handlePlayerVote = async (
  targetPlayerId: string
) => {
  if (
    !classicGame?.round?.roundId ||
    !currentPlayer ||
    !classicGame.round
  ) {
    return;
  }

  if (
    classicGame.round.phase !== "voting" &&
    classicGame.round.phase !== "tieBreak"
  ) {
    return;
  }

  if (
    !players.some(
      (player) =>
        player.id ===
          currentPlayer.playerId &&
        player.isAlive
    )
  ) {
    return;
  }

  if (
    myRoundVote?.hasVoted
  ) {
    return;
  }

  if (
    targetPlayerId ===
    currentPlayer.playerId
  ) {
    return;
  }

try {
  const result = await castRoundVote({
    roundId:
      classicGame.round.roundId,

    targetPlayerId:
      targetPlayerId as Id<"gameRoomPlayers">,

    skipped: false,
  });

  if (result.shouldFinalize) {
    try {
      await finalizeRoundVoting({
        roundId:
          classicGame.round.roundId,
      });
    } catch (finalizeError) {
      console.error(
        "FINALIZE VOTE ERROR:",
        finalizeError
      );
    }
  }
} catch (error) {
  console.error(
    "CAST VOTE ERROR:",
    error
  );
}
};

const handleSkipVote = async () => {
  if (
    !classicGame?.round?.roundId ||
    !currentPlayer ||
    !classicGame.round
  ) {
    return;
  }

  if (
    classicGame.round.phase !== "voting" &&
    classicGame.round.phase !== "tieBreak"
  ) {
    return;
  }

  if (
    !players.some(
      (player) =>
        player.id ===
          currentPlayer.playerId &&
        player.isAlive
    )
  ) {
    return;
  }

  if (
    myRoundVote?.hasVoted
  ) {
    return;
  }

 try {
  const result = await castRoundVote({
    roundId:
      classicGame.round.roundId,

    targetPlayerId:
      undefined,

    skipped: true,
  });

  if (result.shouldFinalize) {
    try {
      await finalizeRoundVoting({
        roundId:
          classicGame.round.roundId,
      });
    } catch (finalizeError) {
      console.error(
        "FINALIZE SKIP ERROR:",
        finalizeError
      );
    }
  }
} catch (error) {
  console.error(
    "SKIP VOTE ERROR:",
    error
  );
}
};

  const startClassicSpeaking =
  useMutation(
    api.games.spy.classic.turns
      .startClassicSpeaking
  );


  /* =========================
   🎬 START SPEAKING AFTER
   ROUND INTRO
========================= */

useEffect(() => {
  if (
    !validRoomId ||
    !classicGame?.round?.roundId ||
    classicGame.round.phase !== "roundIntro" ||
    !classicGame.round.roundIntroEndsAt
  ) {
    return;
  }

  let cancelled = false;

  const startSpeaking = async () => {
    if (cancelled) return;

    try {
      await startClassicSpeaking({
        roundId: classicGame.round!.roundId,
      });
    } catch (error) {
      if (!cancelled) {
        console.error(
          "START CLASSIC SPEAKING ERROR:",
          error
        );
      }
    }
  };

  const remaining = Math.max(
    0,
    classicGame.round.roundIntroEndsAt -
      Date.now()
  );

 const timer = setTimeout(
  startSpeaking,
  remaining
);

  return () => {
    cancelled = true;
    clearTimeout(timer);
  };
}, [
  validRoomId,
  classicGame?.round?.roundId,
  classicGame?.round?.phase,
  classicGame?.round?.roundIntroEndsAt,
  startClassicSpeaking,
]);



/* =========================
   🎬 CATEGORY RESULT DELAY
========================= */

const CATEGORY_RESULT_DURATION = 4200;

const [
  showCategoryResult,
  setShowCategoryResult,
] = useState(false);

const [
  categoryRevealStarted,
  setCategoryRevealStarted,
] = useState(false);

const shownCategoryRef =
  useRef<string | null>(null);

const matchId =
  classicGame?.match?.matchId;

useEffect(() => {
  /*
   * Reset all reveal state whenever
   * a completely new match begins.
   */
  if (!matchId) {
    return;
  }

setSecretReady(false);
setCategoryRevealStarted(false);
setShowCategoryResult(false);
setSecretRevealEndsAt(null);

  shownCategoryRef.current = null;
}, [matchId]);

useEffect(() => {
  const category =
    classicGame?.match?.category;

  if (
    classicGame?.room?.status !==
      "playing" ||
    !category ||
    !matchId
  ) {
    return;
  }

  /*
   * Category result belongs to this
   * specific match, not just the category.
   */
  if (
    shownCategoryRef.current ===
    matchId
  ) {
    return;
  }

  shownCategoryRef.current =
    matchId;

  /*
   * This is the gate that prevents
   * PrivateWordReveal from flashing
   * before the category result.
   */
  setCategoryRevealStarted(true);

  setShowCategoryResult(true);

  const timer =
    setTimeout(() => {
      setShowCategoryResult(false);
    }, CATEGORY_RESULT_DURATION);

  return () => {
    clearTimeout(timer);
  };
}, [
  classicGame?.room?.status,
  classicGame?.match?.category,
  matchId,
]);

const votingStarted =
  classicGame?.round?.phase ===
    "voting" ||
  classicGame?.round?.phase ===
    "tieBreak";

const showPrivateReveal =
  classicGame?.room?.status ===
    "playing" &&
  categoryRevealStarted &&
  !showCategoryResult &&
  !secretReady &&
  !!classicGame?.mySecret;



/* =========================
   🎤 SPEAKING TIMER
========================= */

const [speakingRemaining, setSpeakingRemaining] =
  useState<number | null>(null);

const [votingRemaining, setVotingRemaining] =
  useState<number | null>(null);

useEffect(() => {
  const endsAt =
    classicGame?.round?.turnEndsAt;

  if (
    classicGame?.round?.phase !==
      "speaking" ||
    !endsAt
  ) {
    setSpeakingRemaining(null);
    return;
  }

  const updateTimer = () => {
    const now =
      Date.now();

const remaining =
  Math.max(
    0,
    Math.ceil(
      (endsAt - now) / 1000
    )
  );

    setSpeakingRemaining(
      remaining
    );
  };

  updateTimer();

  const interval =
    setInterval(
      updateTimer,
      100
    );

  return () => {
    clearInterval(interval);
  };
}, [
  classicGame?.round?.phase,
  classicGame?.round?.turnEndsAt,
  showPrivateReveal,
  secretRevealEndsAt,
]);


/* =========================
   🗳️ VOTING TIMER
========================= */

useEffect(() => {
  const endsAt =
    classicGame?.round?.votingEndsAt;

  if (
  classicGame?.round?.phase !== "voting" &&
classicGame?.round?.phase !== "tieBreak" ||
    !endsAt
  ) {
    setVotingRemaining(null);
    return;
  }

  const updateTimer = () => {
    const remaining = Math.max(
      0,
      Math.ceil(
        (endsAt - Date.now()) / 1000
      )
    );

    setVotingRemaining(remaining);
  };

  updateTimer();

  const interval =
    setInterval(
      updateTimer,
      250
    );

  return () => {
    clearInterval(interval);
  };
}, [
  classicGame?.round?.phase,
  classicGame?.round?.votingEndsAt,
]);


/* =========================
   🏁 AUTO FINALIZE VOTING
========================= */

useEffect(() => {
  if (
    !validRoomId ||
    !classicGame?.round?.roundId ||
  classicGame.round.phase !== "voting" &&
classicGame.round.phase !== "tieBreak" ||
    votingRemaining !== 0
  ) {
    return;
  }

  let cancelled = false;

  const finalizeVoting =
    async () => {
      try {
        await finalizeRoundVoting({
          roundId:
            classicGame.round!.roundId,
        });
      } catch (error) {
        if (!cancelled) {
          console.error(
            "AUTO FINALIZE VOTING ERROR:",
            error
          );
        }
      }
    };

  /*
   * Small delay gives the client
   * timer and server timestamp a
   * moment to converge.
   */
  const timer = setTimeout(
    finalizeVoting,
    150
  );

  return () => {
    cancelled = true;
    clearTimeout(timer);
  };
}, [
  validRoomId,
  classicGame?.round?.roundId,
  classicGame?.round?.phase,
  votingRemaining,
  finalizeRoundVoting,
]);




/* =========================
   🔐 PRIVATE WORD REVEAL TIMER
========================= */

useEffect(() => {
  if (!showPrivateReveal) {
    return;
  }

const timer = setTimeout(() => {
  setSecretReady(true);
}, 5000);

  return () => {
    clearTimeout(timer);
  };
}, [showPrivateReveal]);


  const currentSpeaker =
  classicGame?.currentSpeaker;

const currentSpeakerPlayer =
  players.find(
    (player) =>
      player.userId ===
      currentSpeaker?.userId
  );

  const currentSpeakerUserId =
  currentSpeaker?.userId;

const currentSpeakerName =
  currentSpeakerPlayer?.name ??
  "Unknown";

const currentSpeakerAvatar =
  currentSpeakerPlayer?.avatar;

/* =========================
   🎤 AUTO ADVANCE TURN
========================= */

useEffect(() => {
  if (
    !validRoomId ||
    !classicGame?.round?.roundId ||
    classicGame.round.phase !==
      "speaking" ||
    speakingRemaining !== 0 ||
    showPrivateReveal ||
    showCategoryResult
  ) {
    return;
  }

  let cancelled = false;

  const roundId =
    classicGame.round.roundId;

  const advanceTurn = async () => {
    if (cancelled) {
      return;
    }

    try {
      const result =
        await advanceClassicTurn({
          roundId,
        });

      /*
       * The server decides whether
       * the turn was actually ready.
       *
       * Multiple players may call this
       * at the same time. Only one
       * successful mutation will advance
       * the round.
       */

      if (
        !result?.advanced &&
        result?.reason !==
          "TURN_NOT_EXPIRED"
      ) {
        console.log(
          "TURN NOT ADVANCED:",
          result
        );
      }
    } catch (error) {
      if (!cancelled) {
        console.error(
          "AUTO ADVANCE TURN ERROR:",
          error
        );
      }
    }
  };

  /*
   * Small safety delay so the server's
   * timestamp has definitely expired.
   */

  const timer =
    setTimeout(
      advanceTurn,
      500
    );

  return () => {
    cancelled = true;
    clearTimeout(timer);
  };
}, [
  validRoomId,

  classicGame?.round?.roundId,

  classicGame?.round?.phase,

  speakingRemaining,

  advanceClassicTurn,

  showPrivateReveal,

  showCategoryResult,
]);


  return (
    <SafeAreaView
      style={styles.container}
      edges={["left", "right"]}
    >
      <LobbyBackground />

      {room?.status === "playing" && (
  <View
    pointerEvents="none"
    style={styles.gameDimOverlay}
  />
)}

{/* =========================
        🗳️ VOTING RESULT
    ========================= */}

    {showVotingResult && (
      <LobbyOverlay
        visible={true}
        contentStyle={styles.votingResultOverlay}
        onClose={() => {}}
      >
        <VotingResultCard
        playerName={
  displayVotingResult
    ?.eliminatedPlayer?.name ??
  "NO ONE"
}

         playerAvatar={
  displayVotingResult
    ?.eliminatedPlayer?.avatar
}

        voteCount={
  displayVotingResult?.voteCount ??
  0
}

         voters={
  displayVotingResult?.voterIds
    ? players
        .filter((player) =>
          displayVotingResult.voterIds?.some(
            (voterId) =>
              voterId === player.id
          )
        )
        .map((player) => ({
          id: player.id,
          avatar: player.avatar,
        }))
    : []
}
      role={
  displayVotingResult?.role
}

showRole={
  showVotingRole &&
  !!displayVotingResult?.eliminatedPlayer
}
        />
      </LobbyOverlay>
    )}


      {/* HEADER */}

      <View
        style={[
          styles.header,
          {
            height: 100 * scale,
          },
        ]}
      >

<LobbyHeader
  onSettings={() => {}}
  onRules={() => {}}
  onVolume={() => {}}
  onExit={() => {}}

  roomCode={
    room?.roomCode
  }

  isHost={
    currentPlayer?.isHost === true
  }

  word={
    classicGame?.mySecret?.word
  }

  gameStarted={
    room?.status === "playing"
  }

  votingStarted={
  classicGame?.round?.phase === "voting" ||
  classicGame?.round?.phase === "tieBreak"
}
turnEndsAt={
  classicGame?.round?.votingEndsAt
}
votingRemaining={
  votingRemaining
}
/>
      </View>


      {/* PLAYERS */}

      <View
        style={[
          styles.players,
          {
            height: playerAreaHeight,
            paddingHorizontal: Math.max(
              5,
              width * 0.012
            ),
          },
        ]}
      >
<View
  style={
    styles.playerAreaInner
  }
>

<LobbyPlayersSection
  players={players}
  maxPlayers={
    room?.maxPlayers ?? 4
  }
  advancedRoom={false}
  votingStarted={
    votingStarted
  }
  currentSpeakerUserId={
    currentSpeakerUserId
  }
  isPlaying={
    room?.status === "playing"
  }
  currentPlayerId={
    currentPlayer?.playerId
  }
  hasVoted={
    myRoundVote?.hasVoted ??
    false
  }
  onVote={
    handlePlayerVote
  }
  onSkipVote={
    handleSkipVote
  }
  allOtherPlayersReady={
    allOtherPlayersReady
  }
/>

<LobbyTurnIndicator
  visible={
    classicGame?.round?.phase === "speaking" &&
    !showCategoryResult &&
    !showPrivateReveal
  }

isMyTurn={
  currentSpeakerPlayer?.id ===
  currentPlayer?.playerId
}

  speakerName={currentSpeakerName}

  speakerAvatar={currentSpeakerAvatar}

  speakerNumber={
    currentSpeakerPlayer
      ? players.findIndex(
          (player) =>
            player.id ===
            currentSpeakerPlayer.id
        ) + 1
      : undefined
  }

  remaining={
    speakingRemaining
  }
turnEndsAt={
  classicGame?.round?.turnEndsAt
}
  onSkipTurn={
    handleSkipTurn
  }
/>



{/* =========================
    WAITING INFO
========================= */}

{room?.status === "lobby" && (
  <View style={styles.waitingInfoInside}>
    <LobbyInfoPanel
      currentPlayers={players.length}
      maxPlayers={
        room?.maxPlayers ?? 4
      }
      roomStatus={
        room?.status ?? "lobby"
      }
      isHost={
        room?.status === "lobby" &&
        currentPlayer?.isHost === true
      }
      isReady={
        currentPlayer?.isReady ?? false
      }
      canStart={
        canStartGame
      }
      onInvite={() => {}}
      onReady={
        currentPlayer?.isHost
          ? handleStartGame
          : handleReady
      }
    />
  </View>
)}
</View>
      </View>

      {/* CHAT */}

<View
  style={[
    styles.chat,
    {
      left: Math.max(
        10,
        width * 0.06
      ),

      right: Math.max(
        10,
        width * 0.06
      ),

      bottom: 58,

      height: chatHeight,
    },
  ]}
>
        <LobbyChat
          messages={MOCK_MESSAGES}
          gameStarted={DEMO_GAME_STARTED}
        />

        {/* CHAT INPUT */}

        {chatOpen && (
  <KeyboardComposer
    style={styles.chatComposer}
  >
    <LobbyChatInput
      onSend={() => {
        setChatOpen(false);
      }}
    />
  </KeyboardComposer>
)}
      </View>

          {/* =========================
          🗂️ CLASSIC CATEGORY SELECTION
      ========================= */}

     {classicGame?.room?.status === "starting" &&
  classicGame.room.categoryOptions &&
  classicGame.room.categoryOptions.length > 0 &&
  classicGame.room.categorySelectionEndsAt &&
  classicGame.room.categorySelectionEndsAt > Date.now() && (
      <CategorySelection
  visible={true}

  roomId={validRoomId!}

  categories={
    classicGame.room
      .categoryOptions
  }

  selectedCategory={
    classicGame.room
      .category
  }

  endsAt={
    classicGame.room
      .categorySelectionEndsAt
  }

  isHost={
    classicGame.myPlayer
      .isHost
  }

  hasVoted={
    classicGame.hasVoted
  }

  onVote={async (
    category
  ) => {
    if (!validRoomId) {
      return;
    }

    await castCategoryVote({
      roomId:
        validRoomId,

      categoryId:
        category,
    });
  }}

  onFinalize={async () => {
    if (!validRoomId) {
      return;
    }

    await finalizeCategorySelection({
      roomId:
        validRoomId,
    });
  }}
/>
        )}


{/* =========================
    🔢 ROUND INTRO
========================= */}

{classicGame?.round?.phase === "roundIntro" &&
  !showCategoryResult &&
  !showPrivateReveal && (
   <LobbyOverlay
  visible={true}
  contentStyle={styles.roundIntroContent}
 onClose={() => {}}
>
      <RoundIntroCard
        roundNumber={
          classicGame.round.roundNumber
        }
      />
    </LobbyOverlay>
  )}

      {/* =========================
          🔐 PRIVATE WORD REVEAL
      ========================= */}

 <PrivateWordReveal
  visible={
    showPrivateReveal
  }

  role={
    classicGame?.mySecret
      ?.role
  }

  word={
    classicGame?.mySecret
      ?.word
  }

  category={
    classicGame?.match
      ?.category
  }

  onReady={() => {
    setSecretReady(
      true
    );
  }}
/>
{/* =========================
    🏷️ FINAL CATEGORY RESULT
========================= */}

{showCategoryResult &&
  classicGame?.match?.category && (
    <LobbyOverlay
      visible={true}
      contentStyle={
        styles.categoryResultOverlay
      }
      onClose={() => {}}
    >
      <View
        style={
          styles.categoryResultContainer
        }
      >
        <View
          style={
            styles.categoryResultBoard
          }
        >
          <Image
            source={require(
              "@/assets/images/games/spy/boards/villagersboard.png"
            )}
            contentFit="contain"
            style={
              styles.categoryResultBoardImage
            }
          />

          <View
            style={
              styles.categoryResultContent
            }
          >
            <Text
              style={
                styles.categoryResultLabel
              }
            >
              CATEGORY SELECTED
            </Text>

            <View
              style={
                styles.categoryResultPlate
              }
            >
              <View
                pointerEvents="none"
                style={
                  styles.categoryResultHighlight
                }
              />

              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.55}
                style={
                  styles.categoryResultText
                }
              >
                {classicGame.match.category.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </LobbyOverlay>
  )}

      {/* BOTTOM BAR */}

   <View style={styles.bottomBar}>
<LobbyBottomBar
  isHost={
    classicGame?.myPlayer?.isHost ??
    false
  }

  onChat={() => {
    setChatOpen(
      (previous) => !previous
    );
  }}

  onReset={async () => {
    if (!validRoomId) {
      return;
    }

    try {
      await devRestartClassicGame({
        roomId:
          validRoomId,
      });
    } catch (error) {
      console.error(
        "DEV RESTART ERROR:",
        error
      );
    }
  }}

  onMore={() => {
  }}
/>
</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /* =========================
   CATEGORY RESULT
========================= */

categoryResultOverlay: {
  zIndex: 3000,
  elevation: 3000,

  alignItems: "center",
  justifyContent: "center",
},

categoryResultContainer: {
  width: "100%",

  alignItems: "center",
  justifyContent: "center",

  zIndex: 3000,
  elevation: 3000,
},

gameDimOverlay: {
  ...StyleSheet.absoluteFillObject,

  backgroundColor:
    "rgba(0, 0, 0, 0.10)",

  zIndex: 1,
},

categoryResultBoard: {
  width: "94%",

  maxWidth: 420,

  aspectRatio: 1.18,

  position: "relative",

  alignItems: "center",
  justifyContent: "center",

  zIndex: 3100,
  elevation: 3100,

  transform: [
    {
      translateY: 6,
    },
  ],
},

categoryResultBoardImage: {
  position: "absolute",

  width: "100%",
  height: "100%",

  zIndex: 3100,
  elevation: 3100,
},

categoryResultContent: {
  position: "absolute",

  width: "58%",
  height: "42%",

  top: "42%",

  alignItems: "center",
  justifyContent: "center",

  zIndex: 3200,
  elevation: 3200,
},

categoryResultLabel: {
  color: "#D2A62A",

  fontSize: 10,

  fontWeight: "900",

  letterSpacing: 1.8,

  textAlign: "center",

  marginBottom: 10,
},

roundIntroContent: {
  flex: 1,

  alignItems: "center",

  justifyContent: "center",
},

roundIntroCard: {
  alignItems: "center",
  justifyContent: "center",

  paddingHorizontal: 32,
},

roundIntroLabel: {
  color: "#D2A62A",

  fontSize: 13,

  fontWeight: "900",

  letterSpacing: 4,

  textAlign: "center",

  marginBottom: 2,
},

roundIntroNumber: {
  color: "#FFFFFF",

  fontSize: 76,

  lineHeight: 82,

  fontWeight: "900",

  letterSpacing: -2,

  textAlign: "center",

  textShadowColor:
    "rgba(210,166,42,0.35)",

  textShadowOffset: {
    width: 0,
    height: 2,
  },

  textShadowRadius: 10,
},

roundIntroSubtext: {
  color:
    "rgba(255,255,255,0.65)",

  fontSize: 11,

  fontWeight: "800",

  letterSpacing: 3,

  textAlign: "center",

  marginTop: 8,
},

waitingInfoInside: {
  position: "absolute",

  left: 0,
  right: 0,

  bottom: 8,

  zIndex: 30,
},
categoryResultPlate: {
  width: "82%",

  minHeight: 46,

  borderRadius: 13,

  alignItems: "center",
  justifyContent: "center",

  position: "relative",

  overflow: "hidden",

  // Dark transparent interior
  backgroundColor: "rgba(12, 10, 6, 0.72)",

  // Gold outline only
  borderWidth: 1.5,
  borderColor: "rgba(222, 177, 45, 0.95)",

  elevation: 7,
},


categoryResultHighlight: {
  position: "absolute",

  width: "30%",
  height: "180%",

  left: "30%",
  top: "-40%",

  // Much more subtle than the secret-word plate
  backgroundColor:
    "#7b787521",

  transform: [
    {
      rotate: "28deg",
    },
  ],

  zIndex: 1,
},


categoryResultText: {
  color: "#DDB32F",

  fontSize: 24,

  lineHeight: 29,

  fontWeight: "900",

  letterSpacing: 0.8,

  textAlign: "center",

  width: "86%",

  zIndex: 2,

  textShadowColor:
    "rgba(0,0,0,0.7)",

  textShadowOffset: {
    width: 0,
    height: 1,
  },

  textShadowRadius: 2,
},



  container: {
    flex: 1,
    backgroundColor: "#000",
    overflow: "hidden",
  },

  header: {
    width: "100%",
    flexShrink: 0,
    zIndex: 30,
  },

  players: {
    flexShrink: 0,
    zIndex: 5,

    justifyContent: "center",
    alignItems: "stretch",
  },

  playerAreaInner: {
  flex: 1,

  position: "relative",

  width: "100%",

  zIndex: 10,

  elevation: 10,
},

  speakingTurn: {
  position: "absolute",

  top: 105,

  left: 0,
  right: 0,

  alignItems: "center",

  zIndex: 50,
  elevation: 50,
},

speakingTurnLabel: {
  color: "#D2A62A",

  fontSize: 11,

  fontWeight: "900",

  letterSpacing: 1.5,

  textAlign: "center",
},

speakingTimer: {
  color: "#FFFFFF",

  fontSize: 28,

  fontWeight: "900",

  lineHeight: 32,

  marginTop: 2,

  textAlign: "center",
},


  info: {
    minHeight: 0,
    flexShrink: 0,
    zIndex: 15,
  },

chat: {
  position: "absolute",

  minHeight: 0,

  zIndex: 4,

  overflow: "hidden",
},

chatComposer: {
  position: "absolute",

  left: 0,
  right: 0,
  bottom: 0,

  zIndex: 90,

  paddingHorizontal: 12,
  paddingBottom: 6,
},

  bottomBar: {
    position: "absolute",

  left: 0,
  right: 0,
  bottom: 0,

  zIndex: 20,
  },

  votingResultOverlay: {
  zIndex: 4000,
  elevation: 4000,

  alignItems: "center",
  justifyContent: "center",
},

  categoryResult: {
  alignItems: "center",
  justifyContent: "center",
},
});
