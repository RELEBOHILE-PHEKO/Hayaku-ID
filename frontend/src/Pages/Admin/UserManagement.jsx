import React, { useEffect, useState } from "react";
import authService from "../../services/authService.js";

const UserManagement = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        authService.getUsers().then(setUsers);
    }, []);

    return (
        <div>
            <h1>User Management</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.username} - {user.role}
                        <button>Promote</button>
                        <button>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserManagement;
