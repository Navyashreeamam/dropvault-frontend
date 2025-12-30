// src/utils/apiHealthCheck.js
import { API_BASE_URL } from './constants';

export const checkAPIHealth = async () => {
  try {
    console.log('🏥 Checking API health at:', API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}/health/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API is healthy:', data);
      return { healthy: true, data };
    } else {
      console.error('⚠️ API returned non-200 status:', response.status);
      return { healthy: false, status: response.status };
    }
  } catch (error) {
    console.error('❌ API health check failed:', error.message);
    console.error('   This usually means:');
    console.error('   1. Backend is not running');
    console.error('   2. CORS is not configured');
    console.error('   3. API URL is incorrect');
    console.error('   Current API URL:', API_BASE_URL);
    return { healthy: false, error: error.message };
  }
};