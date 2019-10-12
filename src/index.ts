import dotenv from "dotenv";
import { Server } from "./server";

dotenv.config();

let server = new Server();
server.start();
