import axios from 'axios'
const BASE_URL="https://lms-backend-5kd7.onrender.com/api/v1"
const axiosInstance=axios.create()
axiosInstance.defaults.baseURL=BASE_URL
axiosInstance.defaults.withCredentials=true;
export default axiosInstance;
