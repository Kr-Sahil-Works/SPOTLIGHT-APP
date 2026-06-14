export type ChatTheme = {
  name: string;

  category:
    | "Featured"
    | "Dark"
    | "Dreamscape"
    | "Hearts"
    | "Landscapes"
    | "Nature"
    | "Special"
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

preview?: any;
};