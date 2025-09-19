import axios from 'axios';

// Base API URL comes from env var at build/runtime
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000'
});

export default API;
