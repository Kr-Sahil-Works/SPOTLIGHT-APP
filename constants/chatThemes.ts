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
  bubbleGradient?: [
  string,
  string,
  ...string[]
];

  wallpaper?: any;
};

const WALLPAPERS = [
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
  require("@/assets/images/ThemeWalls/theme13.jpg"),
  require("@/assets/images/ThemeWalls/theme14.jpg"),
  require("@/assets/images/ThemeWalls/theme15.jpg"),
  require("@/assets/images/ThemeWalls/theme16.jpg"),
  require("@/assets/images/ThemeWalls/theme17.jpg"),
  require("@/assets/images/ThemeWalls/theme18.jpg"),
  require("@/assets/images/ThemeWalls/theme19.jpg"),
  require("@/assets/images/ThemeWalls/theme20.jpg"),
  require("@/assets/images/ThemeWalls/theme21.jpg"),
  require("@/assets/images/ThemeWalls/theme22.jpg"),
  require("@/assets/images/ThemeWalls/theme23.jpg"),
  require("@/assets/images/ThemeWalls/theme24.jpg"),
  require("@/assets/images/ThemeWalls/theme25.jpg"),
  require("@/assets/images/ThemeWalls/theme26.jpg"),
  require("@/assets/images/ThemeWalls/theme27.jpg"),
  require("@/assets/images/ThemeWalls/theme28.jpg"),
  require("@/assets/images/ThemeWalls/theme29.jpg"),
  require("@/assets/images/ThemeWalls/theme30.jpg"),
  require("@/assets/images/ThemeWalls/theme31.jpg"),
  require("@/assets/images/ThemeWalls/theme32.jpg"),
  require("@/assets/images/ThemeWalls/theme33.jpg"),
  require("@/assets/images/ThemeWalls/theme34.png"),
  require("@/assets/images/ThemeWalls/theme35.jpg"),
  require("@/assets/images/ThemeWalls/theme36.jpg"),
  require("@/assets/images/ThemeWalls/theme37.jpg"),
  require("@/assets/images/ThemeWalls/theme38.jpg"),
  require("@/assets/images/ThemeWalls/theme39.jpg"),
  require("@/assets/images/ThemeWalls/theme40.jpg"),
];

export const CHAT_THEMES: ChatTheme[] = [
  /* =========================
     🎨 SOLID COLOR THEMES
  ========================= */

  {
    name: "Green",
    bubbleMe: "#00c548",
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
     🖼️ WALLPAPER THEMES
  ========================= */

{
  name: "Wall 1",
  wallpaper: WALLPAPERS[0],
  bubbleMe: "#ffffff",
  bubbleOther: "#1f2937",
  sendBtn: "#ffffff",
  sendIcon: "#000",
  textMe: "#000",
  textOther: "#fff",
  headerText: "#fff",
  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 2",
  wallpaper: WALLPAPERS[1],
  bubbleMe: "#ffd166",
  bubbleOther: "#3d2d00",
  sendBtn: "#ffd166",
  sendIcon: "#000",
  textMe: "#000",
  textOther: "#fff",
  headerText: "#fff",
  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 3",
  wallpaper: WALLPAPERS[2],
  bubbleMe: "#ff4fd8",
  bubbleOther: "#3b102f",
  sendBtn: "#ff4fd8",
  sendIcon: "#fff",
  textMe: "#fff",
  textOther: "#fff",
  headerText: "#fff",
  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 4",
  wallpaper: WALLPAPERS[3],
  bubbleMe: "#00e5ff",
  bubbleOther: "#062b33",
  sendBtn: "#00e5ff",
  sendIcon: "#000",
  textMe: "#000",
  textOther: "#fff",
  headerText: "#fff",
  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 5",
  wallpaper: WALLPAPERS[4],
  bubbleMe: "#7c3aed",
  bubbleOther: "#22103f",
  sendBtn: "#7c3aed",
  sendIcon: "#fff",
  textMe: "#fff",
  textOther: "#fff",
  headerText: "#fff",
  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 6",
  wallpaper: WALLPAPERS[5],
  bubbleMe: "#22c55e",
  bubbleOther: "#0f2e1a",
  sendBtn: "#22c55e",
  sendIcon: "#000",
  textMe: "#000",
  textOther: "#fff",
  headerText: "#fff",
  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 7",
  wallpaper: WALLPAPERS[6],
  bubbleMe: "#ff7849",
  bubbleOther: "#3b1d14",
  sendBtn: "#ff7849",
  sendIcon: "#000",
  textMe: "#000",
  textOther: "#fff",
  headerText: "#fff",
  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 8",
  wallpaper: WALLPAPERS[7],
  bubbleMe: "#4ade80",
  bubbleOther: "#173223",
  sendBtn: "#4ade80",
  sendIcon: "#000",
  textMe: "#000",
  textOther: "#fff",
  headerText: "#fff",
  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 9",
  wallpaper: WALLPAPERS[8],
  bubbleMe: "#60a5fa",
  bubbleOther: "#14263d",
  sendBtn: "#60a5fa",
  sendIcon: "#fff",
  textMe: "#fff",
  textOther: "#fff",
  headerText: "#fff",
  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 10",
  wallpaper: WALLPAPERS[9],
  bubbleMe: "#f472b6",
  bubbleOther: "#381826",
  sendBtn: "#f472b6",
  sendIcon: "#fff",
  textMe: "#fff",
  textOther: "#fff",
  headerText: "#fff",
  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 11",
  wallpaper: WALLPAPERS[10],
  bubbleMe: "#facc15",
  bubbleOther: "#3d3205",
  sendBtn: "#facc15",
  sendIcon: "#000",
  textMe: "#000",
  textOther: "#fff",
  headerText: "#fff",
  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 12",
  wallpaper: WALLPAPERS[11],
  bubbleMe: "#c084fc",
  bubbleOther: "#2e1848",
  sendBtn: "#c084fc",
  sendIcon: "#fff",
  textMe: "#fff",
  textOther: "#fff",
  headerText: "#fff",
  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 13",
  wallpaper: WALLPAPERS[12],
  bubbleMe: "#38bdf8",
  bubbleOther: "#103447",
  sendBtn: "#38bdf8",
  sendIcon: "#000",
  textMe: "#000",
  textOther: "#fff",
  headerText: "#fff",
  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 14",
  wallpaper: WALLPAPERS[13],
  bubbleMe: "#f43f5e",
  bubbleOther: "#3b1220",
  sendBtn: "#f43f5e",
  sendIcon: "#fff",
  textMe: "#fff",
  textOther: "#fff",
  headerText: "#fff",
  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 15",
  wallpaper: WALLPAPERS[14],
  bubbleMe: "#2dd4bf",
  bubbleOther: "#103b36",
  sendBtn: "#2dd4bf",
  sendIcon: "#000",
  textMe: "#000",
  textOther: "#fff",
  headerText: "#fff",
  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 16",
  wallpaper: WALLPAPERS[15],
  bubbleMe: "#fb7185",
  bubbleOther: "#3b1620",
  sendBtn: "#fb7185",
  sendIcon: "#fff",
  textMe: "#fff",
  textOther: "#fff",
  headerText: "#fff",
  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 17",
  wallpaper: WALLPAPERS[16],
  bubbleMe: "#818cf8",
  bubbleOther: "#1d2347",
  sendBtn: "#818cf8",
  sendIcon: "#fff",
  textMe: "#fff",
  textOther: "#fff",
  headerText: "#fff",
  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 18",
  wallpaper: WALLPAPERS[17],
  bubbleMe: "#f97316",
  bubbleOther: "#3b1f0f",
  sendBtn: "#f97316",
  sendIcon: "#000",
  textMe: "#000",
  textOther: "#fff",
  headerText: "#fff",
  background: "#000",
  header: "#000",
 inputBg: "#111",
},

{
  name: "Wall 19",
  wallpaper: WALLPAPERS[18],
  bubbleMe: "#06b6d4",
  bubbleOther: "#103540",
  sendBtn: "#06b6d4",
  sendIcon: "#fff",
  textMe: "#fff",
  textOther: "#fff",
  headerText: "#fff",
  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 20",
  wallpaper: WALLPAPERS[19],
  bubbleMe: "#84cc16",
  bubbleOther: "#24380b",
  sendBtn: "#84cc16",
  sendIcon: "#000",
  textMe: "#000",
  textOther: "#fff",
  headerText: "#fff",
  background: "#000",
  header: "#000",
  inputBg: "#111",
},


// -----------------------------------------------------------------------------------------------



























// ___________-----------------------------------------------------------------------------------

{
  name: "Wall 21",
  wallpaper: WALLPAPERS[20],

  bubbleMe: "#ff4fd8",
  bubbleOther: "#2a1025",

  bubbleGradient: [
    "#833ab4",
    "#fd1d1d",
    "#fcb045",
  ],

  gradient: [
    "#833ab4",
    "#fd1d1d",
    "#fcb045",
  ],

  sendBtn: "#ff4fd8",
  sendIcon: "#fff",

  textMe: "#fff",
  textOther: "#fff",

  headerText: "#fff",

  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 22",
  wallpaper: WALLPAPERS[21],

  bubbleMe: "#00c6ff",
  bubbleOther: "#10223b",

  bubbleGradient: [
    "#00c6ff",
    "#0072ff",
  ],

  gradient: [
    "#00c6ff",
    "#0072ff",
  ],

  sendBtn: "#00c6ff",
  sendIcon: "#fff",

  textMe: "#fff",
  textOther: "#fff",

  headerText: "#fff",

  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 23",
  wallpaper: WALLPAPERS[22],

  bubbleMe: "#fc466b",
  bubbleOther: "#2d1020",

  bubbleGradient: [
    "#fc466b",
    "#3f5efb",
  ],

  gradient: [
    "#fc466b",
    "#3f5efb",
  ],

  sendBtn: "#fc466b",
  sendIcon: "#fff",

  textMe: "#fff",
  textOther: "#fff",

  headerText: "#fff",

  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 24",
  wallpaper: WALLPAPERS[23],

  bubbleMe: "#12c2e9",
  bubbleOther: "#10243a",

  bubbleGradient: [
    "#12c2e9",
    "#c471ed",
  ],

  gradient: [
    "#12c2e9",
    "#c471ed",
  ],

  sendBtn: "#12c2e9",
  sendIcon: "#fff",

  textMe: "#fff",
  textOther: "#fff",

  headerText: "#fff",

  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 25",
  wallpaper: WALLPAPERS[24],

  bubbleMe: "#f953c6",
  bubbleOther: "#301225",

  bubbleGradient: [
    "#f953c6",
    "#b91d73",
  ],

  gradient: [
    "#f953c6",
    "#b91d73",
  ],

  sendBtn: "#f953c6",
  sendIcon: "#fff",

  textMe: "#fff",
  textOther: "#fff",

  headerText: "#fff",

  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 26",
  wallpaper: WALLPAPERS[25],

  bubbleMe: "#ee0979",
  bubbleOther: "#32101f",

  bubbleGradient: [
    "#ee0979",
    "#ff6a00",
  ],

  gradient: [
    "#ee0979",
    "#ff6a00",
  ],

  sendBtn: "#ee0979",
  sendIcon: "#fff",

  textMe: "#fff",
  textOther: "#fff",

  headerText: "#fff",

  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 27",
  wallpaper: WALLPAPERS[26],

  bubbleMe: "#2193b0",
  bubbleOther: "#102630",

  bubbleGradient: [
    "#2193b0",
    "#6dd5ed",
  ],

  gradient: [
    "#2193b0",
    "#6dd5ed",
  ],

  sendBtn: "#2193b0",
  sendIcon: "#fff",

  textMe: "#fff",
  textOther: "#fff",

  headerText: "#fff",

  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 28",
  wallpaper: WALLPAPERS[27],

  bubbleMe: "#cc2b5e",
  bubbleOther: "#32101d",

  bubbleGradient: [
    "#cc2b5e",
    "#753a88",
  ],

  gradient: [
    "#cc2b5e",
    "#753a88",
  ],

  sendBtn: "#cc2b5e",
  sendIcon: "#fff",

  textMe: "#fff",
  textOther: "#fff",

  headerText: "#fff",

  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 29",
  wallpaper: WALLPAPERS[28],

  bubbleMe: "#42275a",
  bubbleOther: "#181320",

  bubbleGradient: [
    "#42275a",
    "#734b6d",
  ],

  gradient: [
    "#42275a",
    "#734b6d",
  ],

  sendBtn: "#734b6d",
  sendIcon: "#fff",

  textMe: "#fff",
  textOther: "#fff",

  headerText: "#fff",

  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 30",
  wallpaper: WALLPAPERS[29],

  bubbleMe: "#141e30",
  bubbleOther: "#0b1220",

  bubbleGradient: [
    "#141e30",
    "#243b55",
  ],

  gradient: [
    "#141e30",
    "#243b55",
  ],

  sendBtn: "#243b55",
  sendIcon: "#fff",

  textMe: "#fff",
  textOther: "#fff",

  headerText: "#fff",

  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 31",
  wallpaper: WALLPAPERS[30],

  bubbleMe: "#4568dc",
  bubbleOther: "#16203b",

  bubbleGradient: [
    "#4568dc",
    "#b06ab3",
  ],

  gradient: [
    "#4568dc",
    "#b06ab3",
  ],

  sendBtn: "#4568dc",
  sendIcon: "#fff",

  textMe: "#fff",
  textOther: "#fff",

  headerText: "#fff",

  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 32",
  wallpaper: WALLPAPERS[31],

  bubbleMe: "#ff512f",
  bubbleOther: "#32180f",

  bubbleGradient: [
    "#ff512f",
    "#dd2476",
  ],

  gradient: [
    "#ff512f",
    "#dd2476",
  ],

  sendBtn: "#ff512f",
  sendIcon: "#fff",

  textMe: "#fff",
  textOther: "#fff",

  headerText: "#fff",

  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 33",
  wallpaper: WALLPAPERS[32],

  bubbleMe: "#1d4350",
  bubbleOther: "#102028",

  bubbleGradient: [
    "#1d4350",
    "#a43931",
  ],

  gradient: [
    "#1d4350",
    "#a43931",
  ],

  sendBtn: "#a43931",
  sendIcon: "#fff",

  textMe: "#fff",
  textOther: "#fff",

  headerText: "#fff",

  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 34",
  wallpaper: WALLPAPERS[33],

  bubbleMe: "#4facfe",
  bubbleOther: "#10273b",

  bubbleGradient: [
    "#4facfe",
    "#00f2fe",
  ],

  gradient: [
    "#4facfe",
    "#00f2fe",
  ],

  sendBtn: "#4facfe",
  sendIcon: "#fff",

  textMe: "#fff",
  textOther: "#fff",

  headerText: "#fff",

  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 35",
  wallpaper: WALLPAPERS[34],

  bubbleMe: "#43cea2",
  bubbleOther: "#102f28",

  bubbleGradient: [
    "#43cea2",
    "#185a9d",
  ],

  gradient: [
    "#43cea2",
    "#185a9d",
  ],

  sendBtn: "#43cea2",
  sendIcon: "#fff",

  textMe: "#fff",
  textOther: "#fff",

  headerText: "#fff",

  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 36",
  wallpaper: WALLPAPERS[35],

  bubbleMe: "#30cfd0",
  bubbleOther: "#102030",

  bubbleGradient: [
    "#30cfd0",
    "#330867",
  ],

  gradient: [
    "#30cfd0",
    "#330867",
  ],

  sendBtn: "#30cfd0",
  sendIcon: "#fff",

  textMe: "#fff",
  textOther: "#fff",

  headerText: "#fff",

  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 37",
  wallpaper: WALLPAPERS[36],

  bubbleMe: "#667eea",
  bubbleOther: "#1a2140",

  bubbleGradient: [
    "#667eea",
    "#764ba2",
  ],

  gradient: [
    "#667eea",
    "#764ba2",
  ],

  sendBtn: "#667eea",
  sendIcon: "#fff",

  textMe: "#fff",
  textOther: "#fff",

  headerText: "#fff",

  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 38",
  wallpaper: WALLPAPERS[37],

  bubbleMe: "#ff758c",
  bubbleOther: "#321821",

  bubbleGradient: [
    "#ff758c",
    "#ff7eb3",
  ],

  gradient: [
    "#ff758c",
    "#ff7eb3",
  ],

  sendBtn: "#ff758c",
  sendIcon: "#fff",

  textMe: "#fff",
  textOther: "#fff",

  headerText: "#fff",

  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 39",
  wallpaper: WALLPAPERS[38],

  bubbleMe: "#5f2c82",
  bubbleOther: "#22102f",

  bubbleGradient: [
    "#5f2c82",
    "#49a09d",
  ],

  gradient: [
    "#5f2c82",
    "#49a09d",
  ],

  sendBtn: "#49a09d",
  sendIcon: "#fff",

  textMe: "#fff",
  textOther: "#fff",

  headerText: "#fff",

  background: "#000",
  header: "#000",
  inputBg: "#111",
},

{
  name: "Wall 40",
  wallpaper: WALLPAPERS[39],

  bubbleMe: "#232526",
  bubbleOther: "#111315",

  bubbleGradient: [
    "#232526",
    "#414345",
  ],

  gradient: [
    "#232526",
    "#414345",
  ],

  sendBtn: "#414345",
  sendIcon: "#fff",

  textMe: "#fff",
  textOther: "#fff",

  headerText: "#fff",

  background: "#000",
  header: "#000",
  inputBg: "#111",
},
];