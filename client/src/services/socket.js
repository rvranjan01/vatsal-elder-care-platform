// import { io } from "socket.io-client";

// const socket = io(
//   process.env.REACT_APP_SOCKET_ENDPOINT || "http://localhost:5000",
//   {
//     transports: ["websocket", "polling"],
//   },
// );

// export default socket;


import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.REACT_APP_SOCKET_ENDPOINT || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["polling", "websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;