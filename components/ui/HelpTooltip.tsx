"use client";

import { IconHelp } from "@tabler/icons-react";
import { useState } from "react";

interface HelpTooltipProps {
  text: string;
  className?: string;
}

export default function HelpTooltip({ text, className = "" }: HelpTooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <IconHelp className="w-4 h-4 text-gray-400 ml-1" />
      {open && (
        <div className="absolute z-50 bottom-full left-0 mb-1 w-64 max-w-xs bg-white text-xs text-gray-700 border border-gray-200 rounded-md shadow-lg p-3">
          {text}
        </div>
      )}
    </span>
  );
}
