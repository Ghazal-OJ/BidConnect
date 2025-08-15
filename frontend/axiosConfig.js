import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
    ? `${process.env.REACT_APP_API_URL}/api`
    : 'http://localhost:5001/api',
});

api.interceptors.request.use((config) => {
  // try multiple keys just in case: user / auth / token
  const rawUser = localStorage.getItem('user') || localStorage.getItem('auth');
  const rawTokenOnly = localStorage.getItem('token');

  let token;
  if (rawUser) {
    try {
      const obj = JSON.parse(rawUser);
      token = obj?.token;
    } catch {}
  }
  if (!token && rawTokenOnly) token = rawTokenOnly;

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
