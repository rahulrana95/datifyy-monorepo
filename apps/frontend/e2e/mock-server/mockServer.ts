// apps/frontend/e2e/mock-server/mockServer.ts

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { 
  ADMIN_AUTH_ENDPOINTS, 
  AUTH_ENDPOINTS,
  ADMIN_ENDPOINTS 
} from '../../src/constants';

const app = express();
const PORT = process.env.MOCK_SERVER_PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mock data storage
let mockUsers: any[] = [];
let mockAdmins: any[] = [
  {
    id: 1,
    email: 'admin@datifyy.com',
    password: 'admin123', // In real app, this would be hashed
    permissionLevel: 'ADMIN',
    accountStatus: 'active',
    isActive: true,
  }
];
let mockDates: any[] = [];
let mockTokens: Map<string, any> = new Map();

// Helper to generate tokens
const generateToken = () => {
  return 'mock-token-' + Math.random().toString(36).substr(2, 9);
};

// Auth endpoints
app.post(`/api/v1/${ADMIN_AUTH_ENDPOINTS.LOGIN}`, (req, res) => {
  const { email, password } = req.body;
  
  const admin = mockAdmins.find(a => a.email === email && a.password === password);
  
  if (!admin) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
      error: { code: 401, message: 'Invalid email or password' }
    });
  }
  
  const token = generateToken();
  const sessionId = 'session-' + Date.now();
  
  mockTokens.set(token, { admin, sessionId });
  
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      accessToken: token,
      expiresIn: 3600,
      admin: {
        ...admin,
        password: undefined,
        lastLoginAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        loginCount: 1,
        twoFactorMethods: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      sessionId,
      requires2FA: false,
    }
  });
});

app.post(`/api/v1/${AUTH_ENDPOINTS.VERIFY_TOKEN}`, (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token || !mockTokens.has(token)) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  res.json({
    success: true,
    valid: true
  });
});

app.get(`/api/v1/${AUTH_ENDPOINTS.CURRENT_USER}`, (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token || !mockTokens.has(token)) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
  
  const tokenData = mockTokens.get(token);
  
  res.json({
    id: tokenData.admin.id,
    officialEmail: tokenData.admin.email,
    firstName: 'Admin',
    lastName: 'User',
    isAdmin: true,
  });
});

// Dashboard metrics
app.get(`/api/v1/${ADMIN_ENDPOINTS.DASHBOARD_METRICS}`, (req, res) => {
  res.json({
    success: true,
    data: {
      totalSignups: {
        value: 1234,
        change: 12.5,
        label: 'Total Signups',
        icon: 'users',
      },
      verifiedUsers: {
        value: 987,
        change: 8.3,
        label: 'Verified Users',
        icon: 'check',
      },
      activeUsersToday: {
        value: 456,
        change: -2.1,
        label: 'Active Today',
        icon: 'activity',
      },
      activeUsersThisWeek: {
        value: 2345,
        change: 15.7,
        label: 'Active This Week',
        icon: 'calendar',
      },
      revenueData: {
        totalRevenue: 125000,
        revenueByDateType: {
          online: 75000,
          offline: 50000,
        },
        monthlyData: [
          { month: 'Jan', revenue: 10000 },
          { month: 'Feb', revenue: 15000 },
          { month: 'Mar', revenue: 12000 },
          { month: 'Apr', revenue: 18000 },
          { month: 'May', revenue: 22000 },
          { month: 'Jun', revenue: 25000 },
        ],
      },
      topCities: [
        { city: 'Mumbai', users: 450 },
        { city: 'Delhi', users: 380 },
        { city: 'Bangalore', users: 320 },
        { city: 'Pune', users: 280 },
        { city: 'Chennai', users: 220 },
      ],
    }
  });
});

// Unmatched users
app.get(`/api/v1/${ADMIN_ENDPOINTS.UNMATCHED_USERS}`, (req, res) => {
  const users = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    firstName: `User${i + 1}`,
    lastName: 'Test',
    email: `user${i + 1}@example.com`,
    phone: '9876543210',
    dateOfBirth: '1995-01-01',
    gender: i % 2 === 0 ? 'male' : 'female',
    userType: i % 2 === 0 ? 'working_professional' : 'college_student',
    isVerified: true,
    loveTokens: 100,
    photos: [`https://picsum.photos/200/300?random=${i}`],
    preferences: {
      ageRange: { min: 21, max: 30 },
      location: 'Mumbai',
      interests: ['travel', 'music'],
    },
  }));
  
  res.json({
    success: true,
    data: {
      users,
      total: users.length,
      page: 1,
      totalPages: 1,
    }
  });
});

// Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Mock server running on http://localhost:${PORT}`);
  });
}

export default app;