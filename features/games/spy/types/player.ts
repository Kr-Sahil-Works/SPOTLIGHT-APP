export interface LobbyPlayer {
  id: string;

  userId: string;

  name: string;

  avatar: string | number;

  isHost: boolean;

  isReady: boolean;

  isConnected: boolean;

  isSpeaking: boolean;

  isAlive: boolean;
}