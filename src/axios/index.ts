import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:1337/api',
  headers: {
    'content-type': 'application/json',
  },
  //   baseURL: process.env.BASE_URL,
});

export default axiosInstance;
