# Gravtitude Frontend

A comprehensive coding platform frontend built with React and Tailwind CSS.

## Features

### User Profile Dashboard
- **Comprehensive User Statistics**: Display current streak, best streak, problems solved, and last activity
- **Activity Heatmap**: Visual representation of user's coding activity over the past year
- **Problem Solving Progress**: Circular progress indicator and difficulty breakdown
- **Recent Activity Feed**: Real-time updates on submissions, streaks, and achievements
- **Streak Progress**: Visual progress bar with motivational messages

### Components

#### UserStats
A reusable component that displays key user statistics in a compact format:
- Current streak with emoji indicators
- Best streak achieved
- Problems solved count
- Last activity timestamp

#### ActivityHeatmap
A beautiful activity heatmap component that shows:
- 365-day activity grid
- Color-coded submission intensity
- Month labels for easy navigation
- Hover effects with detailed information
- Legend and statistics

#### ProblemProgress
A comprehensive problem-solving progress component featuring:
- Circular progress indicator
- Difficulty breakdown (Easy, Medium, Hard)
- Progress bars for each difficulty level
- Animated transitions

### Routes

The application includes the following user-related routes:

- `/profile/:id` - Full user profile page
- `/dashboard/:id` - Comprehensive user dashboard
- `/user/profile/:id` - User profile (protected route)
- `/user/dashboard/:id` - User dashboard (protected route)

### Usage

#### Basic User Profile
```jsx
import UserProfile from './pages/User/UserProfile';

// Navigate to /profile/{userId}
<Route path="/profile/:id" element={<UserProfile />} />
```

#### User Dashboard
```jsx
import UserDashboard from './pages/User/UserDashboard';

// Navigate to /dashboard/{userId}
<Route path="/dashboard/:id" element={<UserDashboard />} />
```

#### Reusable Components
```jsx
import UserStats from './components/UserStats';
import ActivityHeatmap from './components/ActivityHeatmap';
import ProblemProgress from './components/ProblemProgress';

// Use in your components
<UserStats user={userData} problemStats={stats} />
<ActivityHeatmap submissions={submissionData} user={userData} />
<ProblemProgress problemStats={stats} />
```

### Styling

The application uses Tailwind CSS with a dark theme:
- Primary background: `bg-gray-900`
- Card backgrounds: `bg-gray-800`
- Accent colors: Green for success, Orange for streaks, Blue for information
- Responsive design with mobile-first approach

### Data Structure

#### User Object
```javascript
{
  id: string,
  name: string,
  email: string,
  role: 'USER' | 'ADMIN',
  streak: number,
  maxStreak: number,
  lastSubmittedAt: Date,
  institute: string,
  country: string,
  linkedIn: string,
  github: string,
  about: string,
  createdAt: Date
}
```

#### Problem Stats
```javascript
{
  total: number,
  solved: number,
  easy: number,
  medium: number,
  hard: number
}
```

#### Submission Data
```javascript
{
  date: string, // YYYY-MM-DD format
  count: number // Number of submissions on that date
}
```

### Custom CSS

The application includes custom CSS for the heatmap:
```css
.grid-cols-53 {
  grid-template-columns: repeat(53, minmax(0, 1fr));
}

.heatmap-cell {
  transition: all 0.2s ease-in-out;
}

.heatmap-cell:hover {
  transform: scale(1.25);
  z-index: 10;
}
```

### Future Enhancements

- Real-time data updates using WebSocket
- Advanced analytics and insights
- Social features and leaderboards
- Customizable dashboard layouts
- Export functionality for progress reports

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Navigate to the application and explore the user profile features

## Contributing

When adding new features to the user dashboard:
1. Follow the existing component structure
2. Use the established color scheme and styling patterns
3. Ensure responsive design for mobile devices
4. Add proper error handling and loading states
5. Include hover effects and smooth transitions
