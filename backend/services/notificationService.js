import Notification from '../../db/models/Notification.js';

export const sendPushNotification = async (userId, title, message, type = 'system') => {
  try {
    const notificationId = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const notification = await Notification.create({
      id: notificationId,
      userId,
      title,
      message,
      type
    });
    
    console.log(`📱 [PUSH NOTIFICATION] Sent to user ${userId}: "${title}" - "${message}"`);
    return notification;
  } catch (error) {
    console.error('🚨 [NOTIFICATION SERVICE] Error creating notification:', error.message);
    return null;
  }
};
