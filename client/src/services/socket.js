import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.REACT_APP_SOCKET_URL ||
  window.location.origin.replace(/^http/, "ws");

// Create and export a singleton socket instance
const socket = io(
  process.env.REACT_APP_SOCKET_ENDPOINT || "http://localhost:5000",
  {
    transports: ["websocket", "polling"],
  },
);

export default socket;
