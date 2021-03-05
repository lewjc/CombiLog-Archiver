import { Service } from "../service/types";
import { MessageType } from "./enums/MessageType";

export type SocketMessage = {
  id?: string;
  type: MessageType;
  content: string;
  service: Service;
};
