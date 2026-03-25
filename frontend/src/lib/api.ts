import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  AxiosProgressEvent,
  InternalAxiosRequestConfig,
} from "axios";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

const api: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const originalConfig = error?.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (status === 401 && originalConfig && !originalConfig._retry) {
      originalConfig._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = api
          .post("/users/refresh-token")
          .then(() => undefined)
          .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });
      }

      try {
        await refreshPromise;
        return api(originalConfig);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const unwrap = (response: { data: { data: any } }) => response.data.data as any;

export const apiClient = {
  get: (url: string, params?: Record<string, unknown>) =>
    api.get(url, { params }).then(unwrap) as Promise<any>,
  post: (url: string, data?: unknown, config?: Record<string, unknown>) =>
    api.post(url, data, config).then(unwrap) as Promise<any>,
  patch: (url: string, data?: unknown, config?: Record<string, unknown>) =>
    api.patch(url, data, config).then(unwrap) as Promise<any>,
  delete: (url: string) => api.delete(url).then(unwrap) as Promise<any>,
};

export const apiHelpers = {
  getErrorMessage: (
    error: unknown,
    fallback = "The request could not be completed."
  ) => {
    const axiosError = error as AxiosError<{ message?: string }>;
    const serverMessage = axiosError?.response?.data?.message?.trim();

    if (serverMessage) {
      return serverMessage;
    }

    if (error instanceof Error && error.message?.trim()) {
      return error.message;
    }

    if (axiosError?.code === "ERR_NETWORK" || !axiosError?.response) {
      return "Cannot reach the server right now. Please make sure the backend is running and try again.";
    }

    const status = axiosError.response?.status;
    const method = axiosError.config?.method?.toUpperCase();
    const url = axiosError.config?.url ?? "";

    if (status === 400) {
      if (url.includes("/users/login")) {
        return "Account not found. Check the username or email and try again.";
      }
      if (url.includes("/users/register")) {
        return "Your account could not be created. Please check every field and try again.";
      }
      if (url.includes("/users/change-password")) {
        return "The password change request is invalid. Check your old password and confirm the new one correctly.";
      }
      if (url.includes("/users/update-account")) {
        return "Profile details could not be saved. Review your name, email, channel name, and description.";
      }
      if (url.includes("/videos") && method === "POST") {
        return "The video could not be published. Make sure title, description, video file, and thumbnail are all valid.";
      }
      if (url.includes("/videos") && method === "PATCH") {
        return "The video changes could not be saved. Please review the title, description, and thumbnail.";
      }
      if (url.includes("/comments")) {
        return "The comment could not be saved. Please check the text and try again.";
      }
      if (url.includes("/playlist")) {
        return "The playlist request could not be completed. Please review the playlist details and selected videos.";
      }
      if (url.includes("/tweets")) {
        return "The post could not be saved. Please review the text and try again.";
      }
    }

    if (status === 401) {
      if (url.includes("/users/login")) {
        return "Wrong password. Please try again.";
      }
      return "You need to sign in again to continue.";
    }

    if (status === 403) {
      return "You do not have permission to perform this action.";
    }

    if (status === 404) {
      return "The requested item could not be found. It may have been removed or the link may be outdated.";
    }

    if (status === 409) {
      if (url.includes("/users/register")) {
        return "That username or email is already in use. Try a different one.";
      }
      if (url.includes("/users/update-account")) {
        return "That channel name or email is already being used by another account.";
      }
      return "This action conflicts with existing data. Please refresh and try again.";
    }

    if (status === 413) {
      return "The selected file is too large to upload. Please choose a smaller file.";
    }

    if (status === 422) {
      return "Some of the submitted details are not valid. Please review the form and try again.";
    }

    if (status && status >= 500) {
      return "The server ran into a problem while processing your request. Please try again in a moment.";
    }

    return fallback;
  },
};

export const authApi = {
  register: (payload: FormData) =>
    apiClient.post("/users/register", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  login: (payload: { username?: string; email?: string; password: string }) =>
    apiClient.post("/users/login", payload),
  logout: () => apiClient.post("/users/logout"),
  getCurrentUser: () => apiClient.get("/users/current-user"),
  refreshToken: () => apiClient.post("/users/refresh-token"),
  changePassword: (payload: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => apiClient.post("/users/change-password", payload),
  updateAccount: (payload: {
    fullName: string;
    email: string;
    username: string;
    description?: string;
  }) =>
    apiClient.patch("/users/update-account", payload),
  updateAvatar: (payload: FormData) =>
    apiClient.patch("/users/avatar", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateCover: (payload: FormData) =>
    apiClient.patch("/users/cover-image", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getChannelProfile: (username: string) =>
    apiClient.get(`/users/c/${username}`),
  getWatchHistory: () => apiClient.get("/users/history"),
};

export const videoApi = {
  list: (params?: Record<string, unknown>) => apiClient.get("/videos", params),
  get: (videoId: string) => apiClient.get(`/videos/${videoId}`),
  publish: (
    payload: FormData,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
  ) =>
    apiClient.post("/videos", payload, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    }),
  update: (videoId: string, payload: FormData) =>
    apiClient.patch(`/videos/${videoId}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (videoId: string) => apiClient.delete(`/videos/${videoId}`),
  togglePublish: (videoId: string) =>
    apiClient.patch(`/videos/toggle/publish/${videoId}`),
};

export const commentApi = {
  list: (videoId: string, params?: Record<string, unknown>) =>
    apiClient.get(`/comments/${videoId}`, params),
  add: (videoId: string, payload: { content: string }) =>
    apiClient.post(`/comments/${videoId}`, payload),
  update: (commentId: string, payload: { content: string }) =>
    apiClient.patch(`/comments/c/${commentId}`, payload),
  delete: (commentId: string) => apiClient.delete(`/comments/c/${commentId}`),
};

export const likeApi = {
  toggleVideo: (videoId: string) =>
    apiClient.post(`/likes/toggle/v/${videoId}`),
  toggleComment: (commentId: string) =>
    apiClient.post(`/likes/toggle/c/${commentId}`),
  toggleTweet: (tweetId: string) =>
    apiClient.post(`/likes/toggle/t/${tweetId}`),
  likedVideos: () => apiClient.get("/likes/videos"),
};

export const playlistApi = {
  create: (payload: { name: string; description: string }) =>
    apiClient.post("/playlist", payload),
  listByUser: (userId: string) => apiClient.get(`/playlist/user/${userId}`),
  get: (playlistId: string) => apiClient.get(`/playlist/${playlistId}`),
  update: (playlistId: string, payload: { name: string; description: string }) =>
    apiClient.patch(`/playlist/${playlistId}`, payload),
  delete: (playlistId: string) => apiClient.delete(`/playlist/${playlistId}`),
  addVideo: (videoId: string, playlistId: string) =>
    apiClient.patch(`/playlist/add/${videoId}/${playlistId}`),
  removeVideo: (videoId: string, playlistId: string) =>
    apiClient.patch(`/playlist/remove/${videoId}/${playlistId}`),
};

export const subscriptionApi = {
  toggle: (channelId: string) =>
    apiClient.post(`/subscriptions/c/${channelId}`),
  subscribers: (channelId: string) =>
    apiClient.get(`/subscriptions/c/${channelId}`),
  subscribedChannels: (subscriberId: string) =>
    apiClient.get(`/subscriptions/u/${subscriberId}`),
};

export const tweetApi = {
  create: (payload: { content: string }) => apiClient.post("/tweets", payload),
  listByUser: (userId: string) => apiClient.get(`/tweets/user/${userId}`),
  update: (tweetId: string, payload: { content: string }) =>
    apiClient.patch(`/tweets/${tweetId}`, payload),
  delete: (tweetId: string) => apiClient.delete(`/tweets/${tweetId}`),
};

export const dashboardApi = {
  stats: () => apiClient.get("/dashboard/stats"),
  videos: () => apiClient.get("/dashboard/videos"),
};
