// src/api.js
import axios from 'axios';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://localhost:8080', // 백엔드 서버 주소
  headers: {
    'Content-Type': 'multipart/form-data', // 필요에 따라 헤더 설정
  },
  withCredentials: true, // 쿠키나 인증 정보를 함께 보낼 경우 설정
});

export default api;
