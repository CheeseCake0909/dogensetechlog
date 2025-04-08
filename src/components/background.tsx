"use client"

import { useTheme } from "@/contexts/ThemeContext";

  export default function BackGround() {
    const { darkMode } = useTheme();
    const cyberColor = darkMode ? "#0384C0" : "#F88D01";

    return(
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-neutral-100 dark:bg-[#111111] transition duration-500">
  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* グロー効果のフィルター */}
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.0" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* グリッドパターン */}
      <pattern id="cyber-grid" width="160" height="160" patternUnits="userSpaceOnUse">
        <g
          stroke={cyberColor}
          strokeWidth="1"
          filter="url(#glow)"
          style={{ transition: "stroke 0.5s ease" }}
        >
          {/* 四隅の + 記号 */}
          <g>
            <line x1="10" y1="5" x2="10" y2="15" />
            <line x1="5" y1="10" x2="15" y2="10" />
          </g>
        </g>

        {/* 中央の6x6ドット */}
        {[...Array(6)].map((_, i) =>
          [...Array(6)].map((_, j) => (
            <circle
              key={`dot-${i}-${j}`}
              cx={27 + i * 25}
              cy={27 + j * 25}
              r="1.0"
              fill={cyberColor}
              filter="url(#glow)"
              style={{
                transition: "fill 0.5s ease",
              }}
            />
          ))
        )}
      </pattern>
    </defs>

    <rect width="160%" height="160%" fill="url(#cyber-grid)" opacity="0.5" />
  </svg>
</div>

    )

}