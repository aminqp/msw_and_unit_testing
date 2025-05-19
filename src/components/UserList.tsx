import { User } from '../types';

interface UserListProps {
  users: User[];
}

const UserList = ({ users }: UserListProps) => {
  if (users.length === 0) {
    return <div>No users found.</div>;
  }

  return (
    <div className="user-container">
      <h2>Users</h2>
      <div className="user-list" data-testid="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-card" data-testid="user-item">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
