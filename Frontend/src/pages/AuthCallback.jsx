import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser, setToken } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log('=== FRONTEND AUTH CALLBACK START ===');
        console.log('Current URL:', window.location.href);
        console.log('Search params:', window.location.search);
        
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const error = urlParams.get('error');

        console.log('AuthCallback - URL params:', window.location.search);
        console.log('AuthCallback - Token found:', token ? 'Yes' : 'No');
        console.log('AuthCallback - Token length:', token ? token.length : 'N/A');
        console.log('AuthCallback - Token preview:', token ? token.substring(0, 20) + '...' : 'None');
        console.log('AuthCallback - Error found:', error);

        if (error) {
          console.error('OAuth error received:', error);
          navigate('/signin?error=' + error);
          return;
        }

        if (!token) {
          console.error('=== NO TOKEN FOUND ===');
          console.error('URL parameters available:', Array.from(urlParams.entries()));
          console.error('Current URL:', window.location.href);
          navigate('/signin?error=no_token');
          return;
        }

        console.log('=== TOKEN FOUND - STORING AND FETCHING USER DATA ===');
        // Store token
        localStorage.setItem('authToken', token);
        setToken(token);

        // Fetch user data using the token
        console.log('Fetching user data with token...');
        const response = await fetch('http://localhost:8080/auth/oauth2/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('User data fetch response status:', response.status);
        
        if (response.ok) {
          const userData = await response.json();
          console.log('=== USER DATA RECEIVED ===');
          console.log('User data:', userData);
          
          // Set user data and authentication state
          setUser(userData);
          localStorage.setItem('userData', JSON.stringify(userData));
          localStorage.setItem('userId', userData.id);

          console.log('=== AUTHENTICATION STATE SET ===');

          // Small delay to ensure state is set before navigation
          setTimeout(() => {
            // Redirect based on role
            if (userData.role === 'ADMIN') {
              console.log('=== REDIRECTING TO ADMIN DASHBOARD ===');
              navigate('/admin/dashboard', { replace: true });
            } else {
              console.log('=== REDIRECTING TO USER DASHBOARD ===', userData.id);
              navigate(`/user/dashboard/${userData.id}`, { replace: true });
            }
          }, 100);
        } else {
          const errorData = await response.text();
          console.error('Failed to fetch user data:', response.status, errorData);
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }
      } catch (error) {
        console.error('=== ERROR PROCESSING OAUTH CALLBACK ===');
        console.error('Error:', error);
        console.error('Error details:', error.stack);
        navigate('/signin?error=oauth_processing_failed');
      }
    };

    handleOAuthCallback();
  }, [navigate, setUser, setToken]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
        <p className="text-gray-300">Processing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
