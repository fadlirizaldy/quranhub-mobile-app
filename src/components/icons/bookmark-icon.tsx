import Svg, { Path } from "react-native-svg";

export function BookmarkIcon({ color }: { color?: string }) {
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
      <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </Svg>
  );
}
