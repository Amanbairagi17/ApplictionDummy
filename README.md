# Grabtitude - Learning Platform

A comprehensive learning platform with user registration, problem management, and practice features.

## Project Structure

- **Backend**: Spring Boot application (Java)
- **Frontend**: React application with Vite

## Setup Instructions

### Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Gravtitude/Backend
   ```

2. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   
   The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the Frontend directory:
   ```bash
   cd Gravtitude/Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   
   The frontend will start on `http://localhost:5173`

## Testing the Connection

### Step 1: Verify Backend is Running
- Open your browser and go to `http://localhost:8080/auth/test`
- You should see: "Backend is working! CORS is configured."

### Step 2: Test Frontend-Backend Communication
- Open the frontend at `http://localhost:5173`
- Click the "Test Backend Connection" button
- You should see a success message if the connection is working

### Step 3: Test User Registration
- Navigate to the Sign Up page
- Fill out the registration form
- Check the browser console and backend logs for any errors

## Troubleshooting

### CORS Issues
If you see CORS errors in the browser console:
1. Ensure the backend is running on port 8080
2. Check that the CORS configuration is properly applied
3. Restart the backend after making CORS changes

### Connection Refused
If you see "Connection refused" errors:
1. Verify the backend is running (`./mvnw spring-boot:run`)
2. Check that port 8080 is not blocked by firewall
3. Ensure no other application is using port 8080

### Registration Errors
If user registration fails:
1. Check the backend logs for detailed error messages
2. Verify the database connection (if applicable)
3. Check that all required fields are being sent from the frontend

## API Endpoints

### Authentication
- `POST /auth/register-user` - User registration
- `POST /auth/register-admin` - Admin registration
- `GET /auth/verify-email` - Email verification

### Test
- `GET /auth/test` - Backend connectivity test

## Development Notes

- The frontend uses the `apiCall` utility function for consistent error handling
- CORS is configured to allow all origins during development
- Form validation includes client-side and server-side checks
- Error messages are displayed to users with proper styling