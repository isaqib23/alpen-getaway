import * as bookcarsTypes from "../types/bookcars-types"
import axiosInstance from './axiosInstance'
import apiClient from '../api/client'
import { transformPaginatedResponse } from '../utils/apiTransformers'
import env from '../config/env.config'

/**
 * Get NotificationCounter by UserID.
 *
 * @param {string} userId
 * @returns {Promise<bookcarsTypes.NotificationCounter>}
 */
export const getNotificationCounter = (userId: string): Promise<bookcarsTypes.NotificationCounter> => (
  axiosInstance
    .get(
      `/api/notification-counter/${encodeURIComponent(userId)}`,
      { withCredentials: true }
    )
    .then((res) => res.data)
)

/**
 * Mark Notifications as read.
 *
 * @param {string} userId
 * @param {string[]} ids
 * @returns {Promise<number>}
 */
export const markAsRead = (userId: string, ids: string[]): Promise<number> => (
  axiosInstance
    .post(
      `/api/mark-Notifications-as-read/${encodeURIComponent(userId)}`,
      { ids },
      { withCredentials: true }
    )
    .then((res) => res.status)
)

/**
 * Mark Notifications as unread.
 *
 * @param {string} userId
 * @param {string[]} ids
 * @returns {Promise<number>}
 */
export const markAsUnread = (userId: string, ids: string[]): Promise<number> => (
  axiosInstance
    .post(
`/api/mark-Notifications-as-unread/${encodeURIComponent(userId)}`,
      { ids },
      { withCredentials: true }
    )
    .then((res) => res.status)
)

/**
 * Delete Notifications.
 *
 * @param {string} userId
 * @param {string[]} ids
 * @returns {Promise<number>}
 */
export const deleteNotifications = (userId: string, ids: string[]): Promise<number> => (
  axiosInstance
    .post(
      `/api/delete-Notifications/${encodeURIComponent(userId)}`,
      { ids },
      { withCredentials: true }
)
    .then((res) => res.status)
)

/**
 * Get Notifications.
 *
 * @param {string} userId
 * @param {number} page
 * @returns {Promise<bookcarsTypes.Result<bookcarsTypes.Notification>>}
 */
export const getNotifications = (userId: string, page: number): Promise<bookcarsTypes.Result<bookcarsTypes.Notification>> => {
  try {
    const params = {
      userId: encodeURIComponent(userId),
      page: page + 1, // Server uses 1-based indexing
      limit: env.PAGE_SIZE,
    };

    return apiClient
      .get('/notifications', { params })
      .then((res) => {
        // Transform notification response if needed
        const transformNotification = (notification: any) => ({
          _id: notification.id,
          user: notification.userId,
          message: notification.message,
          booking: notification.bookingId,
          isRead: notification.isRead || false,
          createdAt: notification.createdAt,
        });

        return transformPaginatedResponse(res.data, transformNotification);
      })
      .catch((error) => {
        // Fallback to legacy API
        return axiosInstance
          .get(`/api/Notifications/${encodeURIComponent(userId)}/${page}/${env.PAGE_SIZE}`, { withCredentials: true })
          .then((res) => res.data);
      });
  } catch (error) {
    // Direct fallback to legacy API
    return axiosInstance
      .get(`/api/Notifications/${encodeURIComponent(userId)}/${page}/${env.PAGE_SIZE}`, { withCredentials: true })
      .then((res) => res.data);
  }
}
