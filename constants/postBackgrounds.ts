export interface PostBackground {
  id: string;
  name?: string;
  colors: [string, string, ...string[]] | [string];
  textColor: string;
}

export const POST_BACKGROUNDS: PostBackground[] = [
  { id: "none", name: "None", colors: ["#f9f9f9"], textColor: "#333" },
  { id: "bg1", colors: ["#FF416C", "#FF4B2B"], textColor: "#fff" },
  { id: "bg2", colors: ["#8E2DE2", "#4A00E0"], textColor: "#fff" },
  { id: "bg3", colors: ["#00B4DB", "#0083B0"], textColor: "#fff" },
  { id: "bg4", colors: ["#f12711", "#f5af19"], textColor: "#fff" },
  { id: "bg5", colors: ["#654ea3", "#eaafc8"], textColor: "#fff" },
  { id: "bg6", colors: ["#00c6ff", "#0072ff"], textColor: "#fff" },
  { id: "bg7", colors: ["#fe8c00", "#f83600"], textColor: "#fff" },
  { id: "bg8", colors: ["#11998e", "#38ef7d"], textColor: "#fff" },
  { id: "bg9", colors: ["#FC466B", "#3F5EFB"], textColor: "#fff" },
  { id: "bg10", colors: ["#159957", "#155799"], textColor: "#fff" },
  { id: "bg11", colors: ["#000000", "#434343"], textColor: "#fff" },
  { id: "bg12", colors: ["#C6FFDD", "#FBD786", "#F7797D"], textColor: "#fff" },
  { id: "bg13", colors: ["#614385", "#516395"], textColor: "#fff" },
  { id: "bg14", colors: ["#02aab0", "#00cdac"], textColor: "#fff" },
  { id: "bg15", colors: ["#e94e77", "#d68189"], textColor: "#fff" },
  { id: "bg16", colors: ["#3a1c71", "#d76d77", "#ffaf7b"], textColor: "#fff" },
  { id: "bg17", colors: ["#4ca1af", "#c4e0e5"], textColor: "#000" },
  { id: "bg18", colors: ["#ff5f6d", "#ffc371"], textColor: "#fff" },
  { id: "bg19", colors: ["#ee9ca7", "#ffdde1"], textColor: "#555" },
  { id: "bg20", colors: ["#2193b0", "#6dd5ed"], textColor: "#fff" },
  { id: "bg21", colors: ["#bdc3c7", "#2c3e50"], textColor: "#fff" },
  { id: "bg22", colors: ["#ffd89b", "#19547b"], textColor: "#fff" },
  { id: "bg23", colors: ["#360033", "#0b8793"], textColor: "#fff" },
  { id: "bg24", colors: ["#e6e9f0", "#eef1f5"], textColor: "#333" },
  { id: "bg25", colors: ["#43cea2", "#185a9d"], textColor: "#fff" },
  { id: "bg26", colors: ["#ffafbd", "#ffc3a0"], textColor: "#fff" },
  { id: "bg27", colors: ["#2196f3", "#f44336"], textColor: "#fff" },
  { id: "bg28", colors: ["#009688", "#ffeb3b"], textColor: "#000" },
  { id: "bg29", colors: ["#673ab7", "#e91e63"], textColor: "#fff" },
  { id: "bg30", colors: ["#9c27b0", "#2196f3"], textColor: "#fff" },
];
