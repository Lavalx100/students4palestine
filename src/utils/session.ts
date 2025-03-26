// src/utils/session.ts

import { v4 as uuidv4 } from 'uuid';

export const getSessionId = () => {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = uuidv4(); // ✅ fallback for older devices
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

