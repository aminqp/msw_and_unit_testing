import { useEffect} from 'react';
import UserList from './components/UserList';
import './App.css';
import useFetchUsers from "./hooks/useFetchUsers";

function App() {
    const {fetchUsers, users, loading, error} = useFetchUsers()

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="app">
            <h1>User List Demo</h1>
            <p>This demo shows how to use MSW to mock API calls in tests</p>

            {loading && <div className="loading">Loading users...</div>}
            {error && <div className="error">Error: {error}</div>}
            {!loading && !error && <UserList users={users}/>}
        </div>
    );
}

export default App;
