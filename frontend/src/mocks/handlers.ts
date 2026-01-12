import { http, HttpResponse } from 'msw';
import { User } from '../context/AuthContext';

// Mock user data
const mockUser: User = {
  id: '1',
  email: 'demo@example.com',
  firstName: 'Demo',
  lastName: 'User',
  username: 'demouser',
};

export const handlers = [
  // Auth endpoints
  http.post('*/api/v1/auth/login', async ({ request }) => {
    console.log('[MSW] Login request intercepted');
    const body = await request.json() as { email: string; password: string };
    console.log('[MSW] Login credentials:', { email: body.email });

    // Simple mock validation
    if (body.email === 'demo@example.com' && body.password === 'password') {
      console.log('[MSW] Login successful - returning mock user');
      return HttpResponse.json(mockUser, { status: 200 });
    }

    console.log('[MSW] Login failed - invalid credentials');
    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  http.post('*/api/v1/auth/register', async ({ request }) => {
    const body = await request.json() as {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    };

    return HttpResponse.json(
      {
        ...mockUser,
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
      },
      { status: 201 }
    );
  }),

  // Health check
  http.get('*/health', () => {
    return HttpResponse.json({ status: 'healthy' }, { status: 200 });
  }),

  // User profile endpoint
  http.get('*/api/v1/users/profile', () => {
    return HttpResponse.json(mockUser, { status: 200 });
  }),

  // Users list (for discovery)
  http.get('*/api/v1/users', () => {
    return HttpResponse.json(
      [
        mockUser,
        {
          id: '2',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
        },
        {
          id: '3',
          email: 'jane@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          username: 'janesmith',
        },
      ],
      { status: 200 }
    );
  }),
];
