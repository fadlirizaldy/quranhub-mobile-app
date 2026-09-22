import Svg, { Path } from "react-native-svg";

export function QuranIcon({ color }: { color?: string }) {
  return (
    <Svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color ? color : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </Svg>
  );
}
