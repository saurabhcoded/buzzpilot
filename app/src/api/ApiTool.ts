import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { URL_CONFIG } from "../_constants/url_config";

// Define API Response Type
// interface ApiResponse<T = any> {
//   data: T;
//   status: number;
//   message?: string;
// }

// Create Axios Instance
const API_CALL: AxiosInstance = axios.create({
  baseURL: URL_CONFIG.api_base_url
});
export const API_CALL_FORMDATA: AxiosInstance = axios.create({
  baseURL: URL_CONFIG.api_base_url,
  headers: {
    "Content-Type": "multipart/form-data"
  }
});

// Request Interceptor
// API_CALL.interceptors.request.use(
//   (request: AxiosRequestConfig) => {
//     const storeData = store.getState();
//     const isAdminRoute = request.url?.includes("/admin");
//     const Auth_Token = isAdminRoute
//       ? storeData?.admin?.details?.token
//       : storeData?.user?.details?.access_token;

//     if (Auth_Token) {
//       request.headers = {
//         ...request.headers,
//         Authorization: `Bearer ${Auth_Token}`,
//       };
//     }

//     return request;
//   },
//   (error: AxiosError) => Promise.reject(error)
// );

// Function to Clear User Data & Redirect
// const handleFlushDataAndRedirect = () => {
//   localStorage.clear();
//   store.dispatch(clearUserDetails());
//   store.dispatch(clearUserData());
//   store.dispatch(clearPots());
// };

// Response Interceptor
// API_CALL.interceptors.response.use(
//   (response: AxiosResponse<ApiResponse>) => {
//     if (response.status === 401) {
//       const token = store.getState()?.user?.details?.token;
//       if (token) {
//         console.error(response.data.message || "Unauthorized");
//       }
//       window.location.href = ROUTES.CLIENTSIGNIN;
//       handleFlushDataAndRedirect();
//     }
//     return response;
//   },
//   (error: AxiosError) => {
//     const status = error.response?.status;

//     switch (status) {
//       case 404:
//         console.error("Not Found", error);
//         break;
//       case 401:
//         console.error("Unauthorized Request - Logging out user");
//         const isLoggedIn = !!store.getState()?.user?.details?.access_token;
//         if (isLoggedIn) {
//           handleFlushDataAndRedirect();
//         }
//         break;
//       default:
//         break;
//     }

//     return Promise.reject(error.response);
//   }
// );

export default API_CALL;
