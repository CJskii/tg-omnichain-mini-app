import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";

export function initializeSocket(server: HttpServer, options: any = {}) {
  const io = new SocketServer(server, options);

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
}
