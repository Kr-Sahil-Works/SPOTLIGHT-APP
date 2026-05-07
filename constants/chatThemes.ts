export type ChatTheme = {
  name: string;

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

  wallpaper?: any;
};

export const CHAT_THEMES: ChatTheme[] = [
  /* =========================
     🎨 ROW 1 — SOLID THEMES
  ========================= */

  {
    name: "Green",
    bubbleMe: "#4ade80",
    bubbleOther: "#1f2937",
    background: "#000",
    header: "#000",
    inputBg: "#111",
    textMe: "#000",
    textOther: "#fff",
    headerText: "#fff",
    sendBtn: "#4ade80",
    sendIcon: "#000",
  },

  {
    name: "Blue",
    bubbleMe: "#3b82f6",
    bubbleOther: "#1e293b",
    background: "#020617",
    header: "#020617",
    inputBg: "#0f172a",
    textMe: "#fff",
    textOther: "#fff",
    headerText: "#fff",
    sendBtn: "#3b82f6",
    sendIcon: "#fff",
  },

  {
    name: "Orange",
    bubbleMe: "#f97316",
    bubbleOther: "#1c1917",
    background: "#000",
    header: "#000",
    inputBg: "#111",
    textMe: "#000",
    textOther: "#fff",
    headerText: "#fff",
    sendBtn: "#f97316",
    sendIcon: "#000",
  },

  {
    name: "Red",
    bubbleMe: "#e11d48",
    bubbleOther: "#1f172a",
    background: "#000",
    header: "#000",
    inputBg: "#111",
    textMe: "#fff",
    textOther: "#fff",
    headerText: "#fff",
    sendBtn: "#e11d48",
    sendIcon: "#fff",
  },

  {
    name: "Purple",
    bubbleMe: "#a855f7",
    bubbleOther: "#1e1b4b",
    background: "#000",
    header: "#000",
    inputBg: "#111",
    textMe: "#fff",
    textOther: "#fff",
    headerText: "#fff",
    sendBtn: "#a855f7",
    sendIcon: "#fff",
  },

  {
    name: "Cyan",
    bubbleMe: "#22d3ee",
    bubbleOther: "#083344",
    background: "#020617",
    header: "#020617",
    inputBg: "#0f172a",
    textMe: "#000",
    textOther: "#e0f2fe",
    headerText: "#e0f2fe",
    sendBtn: "#22d3ee",
    sendIcon: "#000",
  },

  {
    name: "Yellow",
    bubbleMe: "#facc15",
    bubbleOther: "#1c1917",
    background: "#000",
    header: "#000",
    inputBg: "#111",
    textMe: "#000",
    textOther: "#fff",
    headerText: "#fff",
    sendBtn: "#facc15",
    sendIcon: "#000",
  },

  {
    name: "Pink",
    bubbleMe: "#ec4899",
    bubbleOther: "#1e1b4b",
    background: "#000",
    header: "#000",
    inputBg: "#111",
    textMe: "#fff",
    textOther: "#fff",
    headerText: "#fff",
    sendBtn: "#ec4899",
    sendIcon: "#fff",
  },

  {
    name: "Indigo",
    bubbleMe: "#6366f1",
    bubbleOther: "#1e1b4b",
    background: "#020617",
    header: "#020617",
    inputBg: "#0f172a",
    textMe: "#fff",
    textOther: "#fff",
    headerText: "#fff",
    sendBtn: "#6366f1",
    sendIcon: "#fff",
  },

  {
    name: "Teal",
    bubbleMe: "#14b8a6",
    bubbleOther: "#042f2e",
    background: "#020617",
    header: "#020617",
    inputBg: "#0f172a",
    textMe: "#000",
    textOther: "#ccfbf1",
    headerText: "#ccfbf1",
    sendBtn: "#14b8a6",
    sendIcon: "#000",
  },

  {
    name: "Slate",
    bubbleMe: "#64748b",
    bubbleOther: "#0f172a",
    background: "#020617",
    header: "#020617",
    inputBg: "#020617",
    textMe: "#fff",
    textOther: "#e2e8f0",
    headerText: "#e2e8f0",
    sendBtn: "#64748b",
    sendIcon: "#fff",
  },

  {
    name: "Neon",
    bubbleMe: "#00ffcc",
    bubbleOther: "#001f1f",
    background: "#000",
    header: "#000",
    inputBg: "#050505",
    textMe: "#000",
    textOther: "#ccfffa",
    headerText: "#00ffcc",
    sendBtn: "#00ffcc",
    sendIcon: "#000",
  },

  /* =========================
     🌈 ROW 2 — GRADIENT THEMES
  ========================= */

  ...[
    {
      n: "Insta",
      b: "#ff4fd8",
      o: "#2b1630",
      g: ["#833ab4", "#fd1d1d", "#fcb045"],
    },
    {
      n: "Sunset",
      b: "#ff9966",
      o: "#3b1f12",
      g: ["#ff9966", "#ff5e62"],
    },
    {
      n: "Ocean",
      b: "#4facfe",
      o: "#10213d",
      g: ["#00f2fe", "#4facfe"],
    },
    {
      n: "Fire",
      b: "#ff512f",
      o: "#2a0e08",
      g: ["#dd2476", "#ff512f"],
    },
    {
      n: "Candy",
      b: "#ff6fd8",
      o: "#351426",
      g: ["#3813c2", "#ff6fd8"],
    },
    {
      n: "Sky",
      b: "#56ccf2",
      o: "#0e2531",
      g: ["#2f80ed", "#56ccf2"],
    },
    {
      n: "Lime",
      b: "#a8ff78",
      o: "#1c2a14",
      g: ["#78ffd6", "#a8ff78"],
    },
    {
      n: "Rose",
      b: "#ff758c",
      o: "#30151d",
      g: ["#ff7eb3", "#ff758c"],
    },
    {
      n: "Royal",
      b: "#7f7fd5",
      o: "#1d1d38",
      g: ["#91eae4", "#7f7fd5"],
    },
    {
      n: "Galaxy",
      b: "#c471f5",
      o: "#24152d",
      g: ["#fa71cd", "#c471f5"],
    },
    {
      n: "Aqua",
      b: "#43e97b",
      o: "#11301f",
      g: ["#38f9d7", "#43e97b"],
    },
    {
      n: "Peach",
      b: "#f6d365",
      o: "#31260d",
      g: ["#fda085", "#f6d365"],
    },
  ].map((t) => ({
    name: t.n,
    bubbleMe: t.b,
    bubbleOther: t.o,
    background: "#000",
    header: "#000",
    inputBg: "#111",
    textMe: "#fff",
    textOther: "#fff",
    headerText: "#fff",
    sendBtn: t.b,
    sendIcon: "#fff",
    gradient:
  t.g as [
    string,
    string,
    ...string[]
  ],
  })),

  /* =========================
     🖼️ ROW 3 — WALLPAPER THEMES
  ========================= */

  ...Array.from({ length: 12 }).map(
    (_, i) => ({
      name: `Wall ${i + 1}`,

      bubbleMe: [
        "#ffffff",
        "#ffd166",
        "#ff4fd8",
        "#00e5ff",
        "#7c3aed",
        "#22c55e",
        "#ff7849",
        "#4ade80",
        "#60a5fa",
        "#f472b6",
        "#facc15",
        "#c084fc",
      ][i],

      bubbleOther: "#111827",

      background: "#000",

      header: "#000",

      inputBg: "#111",

      textMe:
        i === 0 || i === 1
          ? "#000"
          : "#fff",

      textOther: "#fff",

      headerText: "#fff",

      sendBtn: [
        "#ffffff",
        "#ffd166",
        "#ff4fd8",
        "#00e5ff",
        "#7c3aed",
        "#22c55e",
        "#ff7849",
        "#4ade80",
        "#60a5fa",
        "#f472b6",
        "#facc15",
        "#c084fc",
      ][i],

      sendIcon:
        i === 0 || i === 1
          ? "#000"
          : "#fff",

      wallpaper: [
        require("@/assets/images/ThemeWalls/theme1.jpg"),
        require("@/assets/images/ThemeWalls/theme2.jpg"),
        require("@/assets/images/ThemeWalls/theme3.jpg"),
        require("@/assets/images/ThemeWalls/theme4.jpg"),
        require("@/assets/images/ThemeWalls/theme5.jpg"),
        require("@/assets/images/ThemeWalls/theme6.jpg"),
        require("@/assets/images/ThemeWalls/theme7.jpg"),
        require("@/assets/images/ThemeWalls/theme8.jpg"),
        require("@/assets/images/ThemeWalls/theme9.jpg"),
        require("@/assets/images/ThemeWalls/theme10.jpg"),
        require("@/assets/images/ThemeWalls/theme11.jpg"),
        require("@/assets/images/ThemeWalls/theme12.jpg"),
      ][i],
    })
  ),
];