import React from "react";

const COLORS = ["#4C6FFF", "#16C2A3", "#F5A623", "#FF5D5D", "#8B5CF6", "#EC4899"];

const colorFor = (str = "") => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
};

const Avatar = ({ name = "?", size = 32, ring = false, online = false }) => {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <div
        className={`flex items-center justify-center rounded-full text-white font-medium ${
          ring ? "ring-2 ring-white dark:ring-surface-dark" : ""
        }`}
        style={{
          width: size,
          height: size,
          backgroundColor: colorFor(name),
          fontSize: size * 0.38,
        }}
        title={name}
      >
        {initials || "?"}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-signal rounded-full ring-2 ring-white dark:ring-surface-dark" />
      )}
    </div>
  );
};

export default Avatar;
