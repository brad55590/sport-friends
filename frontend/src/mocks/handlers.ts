import { http, HttpResponse } from 'msw';
import { User, Sport } from '../context/AuthContext';

// Mock sports data
const mockSports: Sport[] = [
    { id: '1', name: 'Basketball' },
    { id: '2', name: 'Soccer' },
    { id: '3', name: 'Tennis' },
    { id: '4', name: 'Volleyball' },
    { id: '5', name: 'Swimming' },
    { id: '6', name: 'Golf' },
    { id: '7', name: 'Baseball' },
    { id: '8', name: 'Hockey' },
    { id: '9', name: 'Running' },
    { id: '10', name: 'Cycling' },
    { id: '11', name: 'Yoga' },
    { id: '12', name: 'Pilates' },
    { id: '13', name: 'Boxing' },
    { id: '14', name: 'Martial Arts' },
    { id: '15', name: 'Surfing' },
    { id: '16', name: 'Skiing' },
    { id: '17', name: 'Snowboarding' },
    { id: '18', name: 'Climbing' },
    { id: '19', name: 'Hiking' },
    { id: '20', name: 'Fishing' },
];

// Mock user data
const mockUser: User = {
    id: '1',
    email: 'demo@example.com',
    firstName: 'Demo',
    lastName: 'User',
    username: 'demouser',
    bio: 'Sports enthusiast looking for friends',
    avatar: '',
    sports: [mockSports[0], mockSports[1]],
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
            return HttpResponse.json(mockUser, { 
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        console.log('[MSW] Login failed - invalid credentials');
        return HttpResponse.json(
            { error: 'Invalid credentials' },
            { 
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            }
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
            { 
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }),

    // Health check
    http.get('*/health', () => {
        return HttpResponse.json({ status: 'healthy' }, { 
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }),

    // User profile endpoint
    http.get('*/api/v1/users/profile', () => {
        return HttpResponse.json(mockUser, { 
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }),

    // Update user profile endpoint
    http.post('*/api/v1/users/profile', async ({ request }) => {
        const body = await request.json() as Partial<User>;
        console.log('[MSW] Profile update request:', body);
        console.log('[MSW] Sports in request:', body.sports?.map(s => s.name) || 'none');
        
        // Update the mock user with new data (persists for subsequent requests)
        Object.assign(mockUser, body);
        
        console.log('[MSW] Profile updated - mockUser now has sports:', mockUser.sports?.map(s => s.name) || 'none');
        return HttpResponse.json(mockUser, { 
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
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
            { 
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }),

    // Sports list endpoint
    http.get('*/api/v1/sports', () => {
        return HttpResponse.json(mockSports, { 
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }),
];
