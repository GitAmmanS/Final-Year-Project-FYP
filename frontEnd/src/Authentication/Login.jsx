import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaseUrl } from '../BaseUrl';
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const submitHandler = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${BaseUrl}/users/authenticate`, {
                email,
                password,
            });
            const user = response.data.user;
            if (user) {
                localStorage.setItem('userName', JSON.stringify(user.name));
                alert("Login Successful");
                setEmail("");
                setPassword("");
                navigate("/");
            } else {
                setErrorMessage("Invalid email or password");
            }
            
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage("An error occurred during login. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-green-100">
            <form
                onSubmit={submitHandler}
                className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg"
            >
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
                    Login
                </h2>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Email:
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Password:
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">
                        Not signed up yet?{" "}
                        <button
                            type="button"
                            onClick={() => navigate('/signup')}
                            className="text-blue-500 hover:underline"
                        >
                            Signup
                        </button>
                    </p>
                </div>
                {errorMessage && (
                    <p className="mb-4 text-sm text-red-500">{errorMessage}</p>
                )}
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg focus:outline-none"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
