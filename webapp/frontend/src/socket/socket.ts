import { io } from "socket.io-client";

export const socket = io("ws://localhost:3333", { autoConnect: false });
