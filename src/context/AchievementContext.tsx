import { createContext, useContext, useCallback, useState } from "react";

export interface AchievementNotificationData {
  type: "achievement" | "streak" | "level" | "challenge";
  title: string;
  message: string;
  icon: string;
  points?: number;
}

interface Notification extends AchievementNotificationData {
  id: string;
  timestamp: Date;
}

interface AchievementContextValue {
  notifications: Notification[];
  showNotification: (data: AchievementNotificationData) => void;
  removeNotification: (id: string) => void;
}

const AchievementContext = createContext<AchievementContextValue>({
  notifications: [],
  showNotification: () => {},
  removeNotification: () => {},
});

let notifCounter = 0;

export const AchievementProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showNotification = useCallback(
    (data: AchievementNotificationData) => {
      const id = `notif_${++notifCounter}_${Date.now()}`;
      const notification: Notification = {
        ...data,
        id,
        timestamp: new Date(),
      };

      setNotifications((prev) => [notification, ...prev.slice(0, 2)]);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    },
    [removeNotification]
  );

  return (
    <AchievementContext.Provider
      value={{ notifications, showNotification, removeNotification }}
    >
      {children}
    </AchievementContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAchievementNotification = () => {
  return useContext(AchievementContext);
};
