import React, { useState, useEffect, useRef } from 'react';

/**
 * A component that renders text with a "fuzzy" or "scrambling" effect.
 * The animation intensity can change on hover.
 */
const FuzzyText = ({
  children,
  baseIntensity = 0.2,
  hoverIntensity = 0.5,
  enableHover = true,
}) => {
  const [displayText, setDisplayText] = useState(children);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef(null);
  const originalText = children;
  
  // The character set to use for scrambling
  const chars = '!<>-_\\/[]{}—=+*^?#________';

  const scramble = (intensity) => {
    let newText = '';
    for (let i = 0; i < originalText.length; i++) {
      // Decide whether to scramble this character based on intensity
      if (Math.random() < intensity) {
        // Pick a random character from the set
        const randomChar = chars[Math.floor(Math.random() * chars.length)];
        newText += randomChar;
      } else {
        // Keep the original character
        newText += originalText[i];
      }
    }
    setDisplayText(newText);
  };

  useEffect(() => {
    // Stop any existing interval when the component re-renders
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Determine the current intensity based on hover state
    const currentIntensity = enableHover && isHovering ? hoverIntensity : baseIntensity;

    // Start a new interval to apply the scrambling effect
    intervalRef.current = setInterval(() => {
      scramble(currentIntensity);
    }, 100); // The effect updates every 100ms

    // Cleanup function to clear the interval when the component is unmounted
    return () => clearInterval(intervalRef.current);
  }, [isHovering, baseIntensity, hoverIntensity, enableHover, originalText]);

  return (
    <span
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ fontFamily: 'monospace' }} // Monospace font helps the effect look stable
    >
      {displayText}
    </span>
  );
};

export default FuzzyText;

