export type ChatTheme = {
  name: string;

  category:
    | "Featured"
    | "ChatPatterns"
    | "Dark"
    | "Dreamscape"
    | "Hearts"
    | "Landscapes"
    | "Lunar"
    | "Nature"
    | "PixelArt"
    | "Together"
    | "Accents"
    | "Solid"
    | "Gradient";

  bubbleMe: string;
  bubbleOther: string;

  background: string;
  header: string;
  inputBg: string;

  textMe: string;
  textOther: string;

  headerText: string;

  sendBtn: string;
  sendIcon: string;

  gradient?: [string, string, ...string[]];

  bubbleGradient?: [
    string,
    string,
    ...string[]
  ];

  gradientDirection?: {
  start: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
};

  wallpaper?: any;
};