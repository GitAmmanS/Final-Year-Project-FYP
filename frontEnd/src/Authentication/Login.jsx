import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaseUrl } from '../utils/BaseUrl';
import uniBg from '../Images/PMAS-Arid-Agriculture-University.jpg.webp';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from "react-icons/fa";

let locales;
const language = sessionStorage.getItem("language");
if (language === "english" || language == null) {
    import("../locales/en.json").then((module) => {
        locales = module.default;
    });
} else {
    import("../locales/ur.json").then((module) => {
        locales = module.default;
    });
}

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alert, setAlert] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (alert && alert.severity === 'success') {
            setTimeout(() => {
                setEmail("");
                setPassword("");
                navigate("/");
            }, 500);
        }
    }, [alert]);

    const submitHandler = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${BaseUrl}/users/authenticate`, {
                email,
                password,
            });

            if (response.status === 200) {
                const { token, user } = response.data;
                sessionStorage.setItem("authToken", token);
                sessionStorage.setItem("user", JSON.stringify(user));
                navigate("/");
                const voice = new SpeechSynthesisUtterance(`Good to see you again, ${user.name}! Let's get started.`);
                window.speechSynthesis.speak(voice);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Logged in Successfully",
                    showConfirmButton: false,
                    timer: 1000,
                    width: "380px"
                });
            } else {
                handleError("An error occurred while logging in.");
            }
        } catch (error) {
            console.error('Error during login:', error);
            handleError("Invalid Credentials.");
        }
    };

    const handleError = (message) => {
        setAlert({ severity: 'error', message });
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: message,
            width: "380px",
            customClass: {
                confirmButton: "bg-[#22C55E] text-white",
            },
        });
    };

    return (
        <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
            <div className="flex w-[90%] h-[85%] shadow-2xl rounded-2xl overflow-hidden">
                <div className="w-[60%]">
                    <img src={uniBg} alt="University" className="h-full w-full object-cover" />
                </div>

                <div className="w-[40%] flex flex-col justify-center items-center bg-white p-8">
                    <h1 className="text-3xl font-extrabold text-green-600 mb-2 text-center">UIIT LabXperts</h1>
                    <h2 className="text-xl font-bold mb-6 text-gray-700 text-center">Login to your account</h2>

                    <form onSubmit={submitHandler} className="w-full max-w-sm">
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div className="mb-4 relative">
                            <label className="block text-gray-700 font-medium mb-2">Password:</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-10 text-gray-500"
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </button>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-gray-600">
                                Not signed up yet?{" "}
                                <button
                                    type="button"
                                    onClick={() => navigate('/signup')}
                                    className="text-green-600 hover:underline"
                                >
                                    Signup
                                </button>
                            </p>
                        </div>

                        <Stack sx={{ width: '100%' }} spacing={2}>
                            {alert && <Alert severity={alert.severity}>{alert.message}</Alert>}
                        </Stack>

                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
