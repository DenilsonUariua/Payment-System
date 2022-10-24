import { notification } from "antd";

export const Notification = (title, message) => {
  return notification.open({
    message: title,
    description: message,
    onClick: () => {
        console.log("Notification Clicked!");
    },
  });
};
