import { io } from "socket.io-client";

const socket = io(
  process.env.REACT_APP_SOCKET_ENDPOINT || "http://localhost:5000",
  {
    transports: ["websocket", "polling"],
  },
);

export default socket;
