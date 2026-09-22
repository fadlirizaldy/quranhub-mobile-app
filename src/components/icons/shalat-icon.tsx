import Svg, { Path } from "react-native-svg";

export function ShalatIcon({ color }: { color?: string }) {
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
      <Path d="M12 2L2 7l10 5 10-5-10-5z" />
      <Path d="M2 17l10 5 10-5" />
      <Path d="M2 12l10 5 10-5" />
    </Svg>
  );
}
