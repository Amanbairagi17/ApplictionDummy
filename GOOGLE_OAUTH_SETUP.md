# Google OAuth Setup Guide

## Prerequisites
Your Google OAuth integration is now fully implemented in the codebase. Follow these steps to complete the setup:

## 1. Google Cloud Console Setup

### Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (for user profile access)

### Configure OAuth 2.0 Credentials
1. Navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Configure the consent screen if prompted
4. Select **Web application** as the application type
5. Add these authorized redirect URIs:
   - `http://localhost:8080/login/oauth2/code/google` (development)
   - `https://yourdomain.com/login/oauth2/code/google` (production)
6. Save and copy your **Client ID** and **Client Secret**

## 2. Backend Configuration

### Create OAuth Properties File
1. Copy the template file:
   ```bash
   cp Backend/src/main/resources/application-oauth.properties.template Backend/src/main/resources/application-oauth.properties
   ```

2. Edit `application-oauth.properties` and replace the placeholders:
   ```properties
   spring.security.oauth2.client.registration.google.client-id=YOUR_ACTUAL_CLIENT_ID
   spring.security.oauth2.client.registration.google.client-secret=YOUR_ACTUAL_CLIENT_SECRET
   ```

### Update Main Application Properties
Add this line to `Backend/src/main/resources/application.properties`:
```properties
spring.profiles.include=oauth
```

## 3. Testing the Integration

### Start the Application
1. Run the backend: `cd Backend && mvn spring-boot:run`
2. Run the frontend: `cd Frontend && npm run dev`
3. Navigate to `http://localhost:5173/signin`
4. Click "Continue with Google"
5. Complete the OAuth flow

### Expected Flow
1. User clicks Google login button
2. Redirected to Google OAuth consent screen
3. After consent, redirected back to `/auth/callback`
4. JWT token generated and user logged in
5. Redirected to dashboard based on user role

## 4. Security Notes

- Never commit your actual Client ID and Client Secret to version control
- Use environment variables in production
- Ensure HTTPS in production for OAuth callbacks
- The redirect URI must exactly match what's configured in Google Cloud Console

## 5. Troubleshooting

### Common Issues
- **Invalid redirect URI**: Check Google Cloud Console configuration
- **Client ID not found**: Verify the properties file is loaded correctly
- **CORS errors**: Ensure frontend URL is in CORS allowed origins
- **Token issues**: Check JWT configuration and secret

### Debug Endpoints
- Test OAuth config: `GET /oauth2/authorization/google`
- Check user info: `GET /oauth2/user-info` (after login)

## Files Modified
- `OAuth2Config.java` - OAuth2 security configuration
- `OAuth2Controller.java` - OAuth2 callback handlers
- `User.java` - Added picture and authProvider fields
- `UserService.java` - OAuth user creation logic
- `SignIn.jsx` - Google login button
- `AuthCallback.jsx` - OAuth callback handler
- `SecurityConfig.java` - Updated security rules
