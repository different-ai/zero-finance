'use client';
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        // Apply all provided CSS variables and background image
        // eslint-disable-next-line react/no-danger
        // This is safe because the string is static and controlled
        // Use Object.assign to merge style objects if needed
        // But here, just use the style string directly
        // @ts-ignore
        '--fontInvertColor': '#e8e8e8',
        '--buttonColor': '#1e1e1e',
        '--borderColorLight': '#1e1e1e44',
        '--inactiveColor': '#8d8d8d',
        '--backgroundColor': '#e8e8e8',
        '--highlightColor': 'hsl(255deg, 80%, 70%)',
        '--listItemIconColor': '#1e1e1e',
        '--plusIconColor': '#1e1e1e',
        '--globeGraphicColor': '#1e1e1e',
        '--tagTextColor': '#1e1e1e',
        '--headingTextColor': '#1e1e1e',
        '--bodyTextColor': '#1e1e1e',
        '--pixelTextColor': '#1e1e1e',
        '--marqueeTextColor': '#1e1e1e',
        '--filterTextActive': '#1e1e1e',
        '--squareTextColor': '#1e1e1e',
        '--sectionLabels': '#1e1e1e',
        '--borderColor': '#1e1e1e',
        '--filterBorderColor': '#1e1e1e44',
        '--tagBorderColor': '#1e1e1e44',
        '--tagHighlightColor': '#c4e817',
        '--dottedBorderColor': '#1e1e1e44',
        '--marqueeTagBorder': '#1e1e1e44',
        '--filterTextInactive': '#1e1e1e44',
        '--navButtonBG': '#1e1e1e11',
        '--counterColor': '#1e1e1e',
        '--windowFrameBG': '#e9e9e9',
        '--artBackground': 'transparent',
        '--artForeground': 'hsl(255deg, 40%, 96%)',
        '--artStroke': '#1e1e1e',
        '--windowBarText': '#011627',
        '--terminalTextSecondary': '#cacaca',
        '--terminalTextPrimary': '#e8e8e8',
        '--terminalHighlight': '#c4e817',
        '--terminalBackground': '#1e1e1e',
        '--listItemText': '#1e1e1e',
        '--invertedTextColor': '#1e1e1e',
        '--codeBG': '#1e1e1e',
        '--codeBorderColor': '#1e1e1e44',
        '--blogImageBorder': '#cacaca',
        '--blogImageBG': '#dedede',
        backgroundImage:
          'linear-gradient(20deg, rgb(241, 249, 243), rgb(243, 241, 249), rgb(249, 243, 241))',
        '--fontColor': 'hsl(255deg, 30%, 10%)',
      }}
      className="bg--100"
    >
      {children}
      <style jsx global>{`
        @keyframes highlightColorPulse {
          0% {
            color: var(--highlightColor);
            filter: drop-shadow(0 0 2px var(--highlightColor));
          }
          50% {
            color: #fff;
            filter: drop-shadow(0 0 8px var(--highlightColor));
          }
          100% {
            color: var(--highlightColor);
            filter: drop-shadow(0 0 2px var(--highlightColor));
          }
        }
        .art-highlight {
          color: var(--highlightColor);
          animation: highlightColorPulse 2s infinite;
          transition: color 0.3s;
        }
      `}</style>
    </div>
  );
}
