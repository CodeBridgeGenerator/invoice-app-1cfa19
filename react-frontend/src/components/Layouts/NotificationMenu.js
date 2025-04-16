import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import client from "../../services/restClient";
import Notification from "../../assets/icons/Notification.js";
import { Avatar } from "primereact/avatar";
import "./Notification.css";
import Notificationunread from "../../assets/icons/Notificationunread.js";

const NotificationMenu = (props) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await client.service("notifications").find({
          // query: {
          //   toUser: props.user._id,
          // },
        });

        // Sort notifications by sent date, with the latest first
        const sortedNotifications = response.data.sort(
          (a, b) => new Date(b.sent) - new Date(a.sent),
        );
        setNotifications(sortedNotifications);

        const unreadExists = sortedNotifications.some(
          (notification) => !notification.read,
        );
        setHasUnreadNotifications(unreadExists);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    client.service("notifications").on("created", (notification) => {
      if (notification.toUser === props.user._id) {
        setNotifications((prevNotifications) => {
          const updatedNotifications = [notification, ...prevNotifications];

          // Sort again to ensure the new notification is at the top
          return updatedNotifications.sort(
            (a, b) => new Date(b.sent) - new Date(a.sent),
          );
        });

        if (!notification.read) {
          setHasUnreadNotifications(true);
        }
      }
    });
  }, [props.user._id, hasUnreadNotifications]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(
        (notification) => !notification.read,
      );
      await Promise.all(
        unreadNotifications.map((notification) =>
          client
            .service("notifications")
            .patch(notification._id, { read: true }),
        ),
      );

      const updatedNotifications = notifications.map((notification) =>
        notification.read ? notification : { ...notification, read: true },
      );

      setNotifications(updatedNotifications);
      setHasUnreadNotifications(false);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    client.service("notifications").patch(notification._id, { read: true });
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) =>
        n._id === notification._id ? { ...n, read: true } : n,
      ),
    );

    if (notification.path) {
      navigate(notification.path);
    } else {
      console.log("No path provided for this notification.");
    }
    setShowNotifications(false);
  };

  return (
    <>
      <div className="notification-icon ml-4" onClick={toggleNotifications}>
        {hasUnreadNotifications ? (
          <Notificationunread style={{ color: "var(--primary-color)" }} />
        ) : (
          <Notification style={{ color: "var(--primary-color)" }} />
        )}
      </div>

      {showNotifications && (
        <div className="notification-panel" ref={notificationRef}>
          <div className="flex flex-col space-y-2">
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 101,
                background: "#fff",
              }}
              className="flex justify-between items-center border-b border-gray-200"
            >
              <div className="flex items-center space-x-2">
                <h5 className="ml-5 mt-4 font-bold">Notifications</h5>
                <div className="bg-gray-200 rounded-full px-2 py-1 text-center mt-2">
                  {
                    notifications.filter((notification) => !notification.read)
                      .length
                  }
                </div>
              </div>
              <span
                style={{ color: "var(--secondary-color)", fontSize: "12px" }}
                className="font-bold cursor-pointer mr-4 inline-flex items-center mt-2"
                onClick={markAllAsRead}
              >
                Mark all as read
              </span>
            </div>
            {notifications
              .filter((notification) => notification.path !== "notifications")
              .map((notification) => (
                <div
                  key={notification._id}
                  className={`flex items-center notification-item ${!notification.read ? "unread" : ""}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-content flex items-center">
                    <Avatar
                      label={
                        notification.toUser
                          ? notification.toUser.charAt(0).toUpperCase()
                          : " "
                      }
                      shape="circle"
                      size="small"
                      className="flex-shrink-0"
                      style={{
                        backgroundColor: "#D30000",
                        color: "#ffffff",
                        marginRight: "10px",
                        borderRadius: "50%",
                      }}
                    />
                    <div className="notification-text ml-2">
                      <div>
                        {notification.content} by {notification.toUser}
                      </div>
                      <div className="notification-time text-xs text-gray-500">
                        {new Date(notification.sent).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "short",
                          },
                        )}
                        ,{" "}
                        {new Date(notification.sent).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          },
                        )}
                      </div>
                    </div>
                    {!notification.read && (
                      <span className="unread-dot ml-auto flex-shrink-0"></span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

const mapState = (state) => {
  const { isLoggedIn, user } = state.auth;
  return { isLoggedIn, user };
};
const mapDispatch = (dispatch) => ({
  logout: () => dispatch.auth.logout(),
});

export default connect(mapState, mapDispatch)(NotificationMenu);
