// api/adminApi.js
import axios from 'axios';

const API_URL = 'https://splinx-server.onrender.com';

const loginAdmin = async (emailAddress, password) => {
    try {
        const response = await axios.post(`${API_URL}/admin-login`, {
            emailAddress,
            password,
        });

        return response.data; // This will contain the token and admin details
    } catch (error) {
        console.error('Error logging in:', error);
        throw error; // Rethrow the error for further handling
    }
};

export default loginAdmin;