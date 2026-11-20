
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

const refreshApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
    const authData = JSON.parse(
        localStorage.getItem("authData") || "null"
    );

    if (!config.headers.Authorization && authData?.accessToken) {
    config.headers.Authorization =
        `Bearer ${authData.accessToken}`;
}

    return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            originalRequest.url?.includes("/Auth/login") ||
            originalRequest.url?.includes("/Auth/register") ||
            originalRequest.url?.includes("/Auth/refresh-token")
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        const authData = JSON.parse(
            localStorage.getItem("authData") || "null"
        );

        if (!authData?.refreshToken) {
            localStorage.removeItem("authData");
            window.dispatchEvent(
                new Event("authSessionExpired")
            );
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((newToken) => {
                originalRequest.headers.Authorization =
                    `Bearer ${newToken}`;

                return api(originalRequest);
            });
        }

        isRefreshing = true;

        try {
            const response = await refreshApi.post(
                "/Auth/refresh-token",
                {
                    refreshToken: authData.refreshToken
                }
            );

            const newAccessToken = response.data.accessToken;
            const newRefreshToken = response.data.refreshToken;

            const updatedAuthData = {
                ...authData,
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            };

            localStorage.setItem(
                "authData",
                JSON.stringify(updatedAuthData)
            );

            window.dispatchEvent(
                new CustomEvent("authTokensUpdated", {
                    detail: {
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken
                    }
                })
            );

            processQueue(null, newAccessToken);

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return api(originalRequest);

        } catch (refreshError) {
            processQueue(refreshError);

            localStorage.removeItem("authData");

            window.dispatchEvent(
                new Event("authSessionExpired")
            );

            return Promise.reject(refreshError);

        } finally {
            isRefreshing = false;
        }
    }
);

export default api;
