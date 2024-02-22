import { useContext } from "react";
import { NotificationsContext } from "../providers/NotificationsProvider";

export default function useNotifications() {
  return useContext(NotificationsContext);
}
