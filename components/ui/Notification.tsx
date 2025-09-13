"use client";

import { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";

interface NotificationProps {
  message: string;
  type: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Notification({
  message,
  type,
  isVisible,
  onClose,
  duration = 3000,
}: NotificationProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[100] transform transition-transform duration-300 ${
        isAnimating ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className={`max-w-7xl mx-auto px-4 py-3 ${getBgColor()} border-b`}>
        <div className="flex items-center justify-center gap-3">
          {getIcon()}
          <span className="text-sm font-medium text-gray-900">{message}</span>
        </div>
      </div>
    </div>
  );
}
