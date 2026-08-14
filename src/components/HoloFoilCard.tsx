import React from "react";

interface HoloFoilCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  enableFoil?: boolean;
}

export const HoloFoilCard: React.FC<HoloFoilCardProps> = ({
  children,
  className = "",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden cursor-pointer ${className}`}
    >
      {children}
    </div>
  );
};
