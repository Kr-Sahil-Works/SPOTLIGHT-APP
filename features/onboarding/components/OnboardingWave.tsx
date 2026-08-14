import Svg, {
    Defs,
    LinearGradient,
    Path,
    Stop,
} from "react-native-svg";

type Props = {
  width: number;
  height?: number;
};

export default function OnboardingWave({
  width,
  height = 26,
}: Props) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      <Defs>
        <LinearGradient
          id="waveGold"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <Stop
            offset="0"
            stopColor="#8B651E"
            stopOpacity="0.25"
          />
          <Stop
            offset="0.5"
            stopColor="#F4C95D"
            stopOpacity="0.85"
          />
          <Stop
            offset="1"
            stopColor="#8B651E"
            stopOpacity="0.25"
          />
        </LinearGradient>
      </Defs>

      <Path
        d={`
          M0 ${height / 2}
          C ${width * 0.08} 0,
            ${width * 0.16} ${height},
            ${width * 0.25} ${height / 2}
          S ${width * 0.42} 0,
            ${width * 0.5} ${height / 2}
          S ${width * 0.67} ${height},
            ${width * 0.75} ${height / 2}
          S ${width * 0.92} 0,
            ${width} ${height / 2}
        `}
        fill="none"
        stroke="url(#waveGold)"
        strokeWidth={1.5}
      />
    </Svg>
  );
}