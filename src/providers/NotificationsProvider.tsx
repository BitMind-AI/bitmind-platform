/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useState } from "react";

const NotificationsContext = createContext({
  messages: [] as {
    id: string;
    show: boolean;
    title: string;
    message: string;
    type: string;
  }[],
  addMessage: (_message: {
    title: string;
    message: string;
    type: string;
  }) => {},
  removeMessage: (_id: string) => {},
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function NotificationsProvider({ children }: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any[]>([]);

  const addMessage = (message: {
    title: string;
    message: string;
    type: string;
  }) => {
    const id = Math.random().toString(36).split(".")[1];
    setMessages((prev) => [
      ...prev,
      {
        ...message,
        id,
        show: true,
      },
    ]);
    setTimeout(() => {
      removeMessage(id);
    }, 5000);
  };

  const removeMessage = (id: string) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === id ? { ...message, show: false } : message
      )
    );
    setTimeout(() => {
      setMessages((prev) => prev.filter((message) => message.id !== id));
    }, 100);
  };

  return (
    <NotificationsContext.Provider
      value={{ messages, addMessage, removeMessage }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export { NotificationsContext, NotificationsProvider };
