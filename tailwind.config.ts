import type { Config } from "tailwindcss"
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}","./components/**/*.{js,ts,jsx,tsx}","./lib/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: { colors: { void:"#06070a",deep:"#0b0d13",panel:"#10131a",ink:"#141820",rim:"#1e2436",gold:"#c9a84c",golds:"#f0d080",ember:"#e03030",neon:"#06b6d4",sage:"#22c55e",violet:"#8b5cf6",sky:"#3b82f6",orange:"#f97316" }, fontFamily: { display:["Bebas Neue","sans-serif"], ui:["Sora","sans-serif"], mono:["JetBrains Mono","monospace"] } } },
  plugins: [],
}
export default config
