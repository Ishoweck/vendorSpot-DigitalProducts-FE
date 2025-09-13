"use client";

import { useEffect } from "react";
import { useQueryClient } from "react-query";
import SocketService from "@/lib/socket";

export const useSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!SocketService.isConnected()) {
      SocketService.connect();
    }

    const handleProductCreated = (data: any) => {
      console.log("🔔 Product created event received:", data);
      queryClient.invalidateQueries(["vendor-products"]);
      queryClient.invalidateQueries(["products"]);
    };

    const handleProductUpdated = (data: any) => {
      console.log("🔔 Product updated event received:", data);
      queryClient.invalidateQueries(["vendor-products"]);
      queryClient.invalidateQueries(["products"]);
    };

    const handleProductDeleted = (data: any) => {
      console.log("🔔 Product deleted event received:", data);
      queryClient.invalidateQueries(["vendor-products"]);
      queryClient.invalidateQueries(["products"]);
    };

    SocketService.on("product:created", handleProductCreated);
    SocketService.on("product:updated", handleProductUpdated);
    SocketService.on("product:deleted", handleProductDeleted);
    console.log("🎧 Socket event listeners registered");

    return () => {
      SocketService.off("product:created", handleProductCreated);
      SocketService.off("product:updated", handleProductUpdated);
      SocketService.off("product:deleted", handleProductDeleted);
      console.log("🎧 Socket event listeners removed");
    };
  }, []);

  return SocketService;
};
