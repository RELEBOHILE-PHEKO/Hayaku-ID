// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.js'; // Import the user slice reducer

// Create the Redux store
const store = configureStore({
    reducer: {
        user: userReducer, // Use the user reducer here
    },
});

// Export the store as the default export
export default store;