import {render, screen, waitFor} from '@testing-library/react';
import App from '../App';
import {mockUser1, mockUser3, mockUser2, mockUsers} from "../__fixtures__/mock-users";

describe('App Component', () => {
    it('renders loading state initially', () => {
        render(<App/>);
        expect(screen.getByText('Loading users...')).toBeInTheDocument();
    });

    it('renders users fetched from API', async () => {
        render(<App/>);

        // Wait for the loading state to disappear
        await waitFor(() => {
            expect(screen.queryByText('Loading users...')).not.toBeInTheDocument();
        });

        // Check that users are displayed
        expect(screen.getByText('Users')).toBeInTheDocument();

        // Check that all mock users are rendered
        expect(screen.getByText(mockUser1.name)).toBeInTheDocument();
        expect(screen.getByText(mockUser2.name)).toBeInTheDocument();
        expect(screen.getByText(mockUser3.name)).toBeInTheDocument();

        // Check that the correct number of user items are rendered
        expect(screen.getAllByTestId('user-item').length).toBe(mockUsers.length);
    });
});
