"use client";

import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(): void {
    if (typeof window !== "undefined" && !this.socket) {
      const serverUrl =
        process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
        "http://localhost:5000";

      console.log("Connecting to socket server:", serverUrl);

      this.socket = io(serverUrl, {
        transports: ["websocket", "polling"],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        forceNew: false,
        autoConnect: true,
      });

      this.socket.on("connect", () => {
        console.log("✅ Connected to server:", this.socket?.id);
      });

      this.socket.on("disconnect", (reason) => {
        console.log("❌ Disconnected from server:", reason);
      });

      this.socket.on("connect_error", (error: unknown) => {
        console.error("🔥 Connection error:", error);
      });

      this.socket.on("reconnect", (attemptNumber) => {
        console.log("🔄 Reconnected after", attemptNumber, "attempts");
      });

      this.socket.on("reconnect_error", (error) => {
        console.error("🔥 Reconnection error:", error);
      });
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public on(event: string, callback: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  public off(event: string, callback?: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  public emit(event: string, data: any): void {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  public isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default SocketService.getInstance();
