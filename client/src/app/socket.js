import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
  withCredentials: true,
  autoConnect: false,
});
socket.on("connect", () => {
  console.log("Socket Connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Socket Disconnected");
});

socket.on("connect_error", (err) => {
  console.log("Socket Error:", err.message);
});

export default socket;
