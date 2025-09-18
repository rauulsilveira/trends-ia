// src/components/Avatar.tsx
import React from "react";

interface AvatarProps {
  name?: string;
  picture?: { data?: { url?: string } };
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ name, picture, size = 40 }) => {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return picture?.data?.url ? (
    <img
      alt="Avatar"
      src={picture.data.url}
      style={{ width: size, height: size, borderRadius: "50%" }}
    />
  ) : (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: "#ccc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        color: "#fff",
      }}
    >
      {initials}
    </div>
  );
};

export default Avatar;
