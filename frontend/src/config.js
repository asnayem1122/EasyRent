const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = rawApiUrl.replace(/\/+$/, '');

export const API_BASE_URL = `${API_URL}/api`;
export const IMAGE_BASE_URL = `${API_URL}/`;
export default API_URL;

