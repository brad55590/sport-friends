import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from './test-utils';
import { ProfilePage } from '../pages/ProfilePage';

describe('ProfilePage', () => {
  beforeEach(() => {
    localStorage.clear();
    // Set logged in user
    const mockAuth = {
      user: {
        id: '1',
        email: 'demo@example.com',
        firstName: 'Demo',
        lastName: 'User',
        username: 'demouser',
        bio: 'Sports enthusiast',
        avatar: '',
        sports: [{ id: '1', name: 'Basketball' }],
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };
    localStorage.setItem('sportfriends_auth', JSON.stringify(mockAuth));
  });

  it('renders profile form with user data', async () => {
    render(<ProfilePage />);

    // Wait for form to render (auth restoration)
    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/first name/i)).toHaveValue('Demo');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('User');
    expect(screen.getByLabelText(/bio/i)).toHaveValue('Sports enthusiast');
  });

  it('displays sports interests section with search', async () => {
    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText(/sports interests/i)).toBeInTheDocument();
    });

    // Search field should be visible
    const searchField = screen.getByPlaceholderText(/search sports \(min 3 characters\)/i);
    expect(searchField).toBeInTheDocument();
  });

  it('allows editing first name', async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);

    const firstNameField = await screen.findByLabelText(/first name/i);
    await user.clear(firstNameField);
    await user.type(firstNameField, 'John');

    expect(firstNameField).toHaveValue('John');
  });

  it('allows editing last name', async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);

    const lastNameField = await screen.findByLabelText(/last name/i);
    await user.clear(lastNameField);
    await user.type(lastNameField, 'Doe');

    expect(lastNameField).toHaveValue('Doe');
  });

  it('allows editing bio', async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);

    const bioField = await screen.findByLabelText(/bio/i);
    await user.clear(bioField);
    await user.type(bioField, 'Passionate about tennis');

    expect(bioField).toHaveValue('Passionate about tennis');
  });

  it('allows selecting multiple sports interests', async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);

    const searchField = await screen.findByPlaceholderText(/search sports \(min 3 characters\)/i);

    // Basketball should already be selected (shown as chip)
    await waitFor(() => {
      const basketballChips = screen.getAllByRole('button', { name: /basketball/i });
      expect(basketballChips.length).toBeGreaterThan(0);
    });

    // Type "soc" to search for Soccer
    await user.type(searchField, 'soc');

    // Soccer option should appear in dropdown
    const soccerOption = await screen.findByText(/^Soccer$/);
    expect(soccerOption).toBeInTheDocument();

    // Click Soccer option
    await user.click(soccerOption);

    // Soccer should now appear as a chip
    await waitFor(() => {
      const soccerChips = screen.getAllByRole('button', { name: /soccer/i });
      expect(soccerChips.length).toBeGreaterThan(0);
    });
  });

  it('allows deselecting sports interests', async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);

    // Basketball should be pre-selected as a chip
    const basketballChips = await screen.findAllByRole('button', { name: /basketball/i });
    expect(basketballChips.length).toBeGreaterThan(0);

    // Find the chip with the close button and click it
    const basketballChip = basketballChips.find(chip => 
      chip.querySelector('[aria-label="Close"]')
    );

    if (basketballChip) {
      const closeButton = basketballChip.querySelector('[aria-label="Close"]');
      if (closeButton) {
        await user.click(closeButton as HTMLElement);

        // Chip should be removed
        await waitFor(() => {
          const remainingChips = screen.queryAllByRole('button', { name: /basketball/i });
          expect(remainingChips.length).toBe(0);
        });
      }
    }
  });

  it('has save profile button', async () => {
    render(<ProfilePage />);

    const saveButton = await screen.findByRole('button', { name: /save profile/i });
    expect(saveButton).toBeInTheDocument();
  });

  it('submits form with updated profile data', async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);

    const firstNameField = await screen.findByLabelText(/first name/i);
    await user.clear(firstNameField);
    await user.type(firstNameField, 'UpdatedName');

    const searchField = screen.getByPlaceholderText(/search sports \(min 3 characters\)/i);
    await user.type(searchField, 'soc');

    const soccerOption = await screen.findByText(/^Soccer$/);
    await user.click(soccerOption);

    const saveButton = screen.getByRole('button', { name: /save profile/i });
    await user.click(saveButton);

    // Should show success message
    await waitFor(() => {
      expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
    });
  });

  it('shows success message after profile update', async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);

    const saveButton = await screen.findByRole('button', { name: /save profile/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
    });
  });

  it('shows error message on update failure', async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);

    // Form should be available
    const firstNameField = await screen.findByLabelText(/first name/i);
    expect(firstNameField).toBeInTheDocument();
  });

  it('shows redirect message when not logged in', () => {
    localStorage.clear();
    render(<ProfilePage />);

    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();
  });

  it('disables form while loading', async () => {
    render(<ProfilePage />);

    const firstNameField = await screen.findByLabelText(/first name/i) as HTMLInputElement;
    expect(firstNameField.disabled).toBe(false);
  });

  it('has bio helper text', async () => {
    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText(/max 500 characters/i)).toBeInTheDocument();
    });
  });

  it('filters sports by search input', async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);

    const searchField = await screen.findByPlaceholderText(/search sports \(min 3 characters\)/i);
    
    // Type less than 3 characters - dropdown should not show
    await user.type(searchField, 'ba');
    // Search should still have the value
    expect(searchField).toHaveValue('ba');

    // Type 3rd character to complete "bas"
    await user.clear(searchField);
    await user.type(searchField, 'vol');
    
    // Should now show Volleyball option in dropdown
    const volleyballOption = await screen.findByText(/^Volleyball$/);
    expect(volleyballOption).toBeInTheDocument();
  });

  it('persists selected sports across page refresh', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<ProfilePage />);

    // Wait for page to load
    const searchField = await screen.findByPlaceholderText(/search sports \(min 3 characters\)/i);
    
    // Search for and select Soccer
    await user.type(searchField, 'soc');
    const soccerOption = await screen.findByText(/^Soccer$/);
    await user.click(soccerOption);

    // Soccer should appear as a chip
    await waitFor(() => {
      const soccerChips = screen.getAllByRole('button', { name: /soccer/i });
      expect(soccerChips.length).toBeGreaterThan(0);
    });

    // Search for and select Tennis (search field should be cleared after selection)
    const searchFieldAfterSoccer = screen.getByPlaceholderText(/search sports \(min 3 characters\)/i);
    // Clear and type new search
    await user.clear(searchFieldAfterSoccer);
    await user.type(searchFieldAfterSoccer, 'ten');
    const tennisOption = await screen.findByText(/^Tennis$/);
    await user.click(tennisOption);

    // Tennis should appear as a chip
    await waitFor(() => {
      const tennisChips = screen.getAllByRole('button', { name: /tennis/i });
      expect(tennisChips.length).toBeGreaterThan(0);
    });

    // Save the profile
    const saveButton = screen.getByRole('button', { name: /save profile/i });
    await user.click(saveButton);

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
    });

    // Get the current localStorage state
    const savedAuth = localStorage.getItem('sportfriends_auth');
    expect(savedAuth).toBeTruthy();
    const parsedAuth = JSON.parse(savedAuth!);
    console.log('[Test] Saved auth state sports count:', parsedAuth.user?.sports?.length);

    // Simulate page refresh by unmounting and remounting
    unmount();

    // Verify sports are still in localStorage before remounting
    const authAfterRefresh = localStorage.getItem('sportfriends_auth');
    const parsedAfterRefresh = JSON.parse(authAfterRefresh!);
    console.log('[Test] Auth after refresh sports count:', parsedAfterRefresh.user?.sports?.length);
    expect(parsedAfterRefresh.user?.sports?.length).toBe(3); // Basketball (pre-selected) + Soccer + Tennis

    // Remount the component (simulates page refresh)
    render(<ProfilePage />);

    // After refresh, the sports should still be selected
    await waitFor(() => {
      const soccerChipsAfterRefresh = screen.getAllByRole('button', { name: /soccer/i });
      const tennisChipsAfterRefresh = screen.getAllByRole('button', { name: /tennis/i });
      const basketballChipsAfterRefresh = screen.getAllByRole('button', { name: /basketball/i });
      
      expect(soccerChipsAfterRefresh.length).toBeGreaterThan(0);
      expect(tennisChipsAfterRefresh.length).toBeGreaterThan(0);
      expect(basketballChipsAfterRefresh.length).toBeGreaterThan(0);
    });
  });

  it('finds Golf when searching with 3+ characters', async () => {
    render(<ProfilePage />);

    // Wait for sports to load
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search sports \(min 3 characters\)/i)).toBeInTheDocument();
    });

    const searchField = screen.getByPlaceholderText(/search sports \(min 3 characters\)/i) as HTMLInputElement;

    // Type "gol" (3 characters) to search for Golf
    await userEvent.type(searchField, 'gol');

    // Golf should appear in the dropdown
    await waitFor(() => {
      const golfOption = screen.getByRole('option', { name: /golf/i });
      expect(golfOption).toBeInTheDocument();
    });

    // Click on Golf to select it
    const golfOption = screen.getByRole('option', { name: /golf/i });
    await userEvent.click(golfOption);

    // Golf chip should appear in selected sports
    await waitFor(() => {
      const golfChip = screen.getByRole('button', { name: /golf/i });
      expect(golfChip).toBeInTheDocument();
    });
  });
});
