import {render, screen} from '@testing-library/react';
import UserList from '../components/UserList';
import {mockUser1, mockUser2, mockUsers} from "../__fixtures__/mock-users";

describe('UserList Component', () => {


    it('displays a message when no users are available', () => {
        render(<UserList users={[]}/>);
        expect(screen.getByText('No users found.')).toBeInTheDocument();
    });

    it('renders a list of users correctly', () => {
        render(<UserList users={mockUsers}/>);

        // Check heading
        expect(screen.getByText('Users')).toBeInTheDocument();

        // Check user details
        expect(screen.getByText(mockUser1.name)).toBeInTheDocument();
        expect(screen.getByText(mockUser1.email)).toBeInTheDocument();
        expect(screen.getByText(mockUser2.name)).toBeInTheDocument();
        expect(screen.getByText(mockUser2.email)).toBeInTheDocument();

        // Check that the correct number of user items are rendered
        expect(screen.getAllByTestId('user-item').length).toBe(mockUsers.length);
    });
});
