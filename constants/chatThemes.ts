export type ChatTheme = {
  name: string;

  bubbleMe: string;
  bubbleOther: string;

  background: string;
  header: string;
  inputBg: string;

  // ✅ separate text colors
  textMe: string;
  textOther: string;

  headerText: string;

  sendBtn: string;
  sendIcon: string;
};

export const CHAT_THEMES: ChatTheme[] = [
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
];