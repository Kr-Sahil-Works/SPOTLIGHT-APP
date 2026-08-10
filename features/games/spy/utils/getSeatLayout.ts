import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export type SeatPosition = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export type SeatLayout = {
  totalSeats: 4 | 6 | 8 | 12;
  avatarSize: number;
  seats: SeatPosition[];
};

export function getSeatLayout(
  playerCount: number
): SeatLayout {
  if (playerCount <= 4) {
    return {
      totalSeats: 4,
      avatarSize: 66,

      seats: [
        {
          top: height * 0.03,
          left: width * 0.18,
        },
        {
          top: height * 0.03,
          right: width * 0.18,
        },
        {
          bottom: height * 0.03,
          left: width * 0.18,
        },
        {
          bottom: height * 0.03,
          right: width * 0.18,
        },
      ],
    };
  }

  if (playerCount <= 6) {
    return {
      totalSeats: 6,
      avatarSize: 62,

      seats: [
        {
          top: height * 0.02,
          left: width * 0.28,
        },
        {
          top: height * 0.02,
          right: width * 0.28,
        },

        {
          top: height * 0.18,
          left: width * 0.02,
        },
        {
          top: height * 0.18,
          right: width * 0.02,
        },

        {
          bottom: height * 0.02,
          left: width * 0.28,
        },
        {
          bottom: height * 0.02,
          right: width * 0.28,
        },
      ],
    };
  }

  if (playerCount <= 8) {
    return {
      totalSeats: 8,
      avatarSize: 58,

      seats: [
        {
          top: height * 0.02,
          left: width * 0.18,
        },
        {
          top: height * 0.02,
          right: width * 0.18,
        },

        {
          top: height * 0.13,
          left: width * 0.01,
        },
        {
          top: height * 0.13,
          right: width * 0.01,
        },

        {
          bottom: height * 0.13,
          left: width * 0.01,
        },
        {
          bottom: height * 0.13,
          right: width * 0.01,
        },

        {
          bottom: height * 0.02,
          left: width * 0.18,
        },
        {
          bottom: height * 0.02,
          right: width * 0.18,
        },
      ],
    };
  }

  return {
    totalSeats: 12,
    avatarSize: 42,

    seats: [
      {
        top: height * 0.02,
        left: width * 0.10,
      },
      {
        top: height * 0.02,
        left: width * 0.30,
      },
      {
        top: height * 0.02,
        right: width * 0.30,
      },
      {
        top: height * 0.02,
        right: width * 0.10,
      },

      {
        top: height * 0.16,
        left: width * 0.01,
      },
      {
        top: height * 0.16,
        left: width * 0.23,
      },
      {
        top: height * 0.16,
        right: width * 0.23,
      },
      {
        top: height * 0.16,
        right: width * 0.01,
      },

      {
        bottom: height * 0.02,
        left: width * 0.10,
      },
      {
        bottom: height * 0.02,
        left: width * 0.30,
      },
      {
        bottom: height * 0.02,
        right: width * 0.30,
      },
      {
        bottom: height * 0.02,
        right: width * 0.10,
      },
    ],
  };
}