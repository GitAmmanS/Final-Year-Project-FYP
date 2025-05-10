import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaseUrl } from '../utils/BaseUrl';
import uniBg from '../Images/PMAS-Arid-Agriculture-University.jpg.webp';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack'
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from "react-icons/fa";

let locales;
const language = localStorage.getItem("language");
if (language === "english") {
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
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    useEffect(() => {
        if (alert && alert.severity === 'success') {
            setTimeout(() => {
                setEmail("");
                setPassword("");
                navigate("/");
            }, 500);
        }

    }, [alert])
    const submitHandler = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${BaseUrl}/users/authenticate`, {
                email,
                password,
            });
            console.log(response);
            if (response.status === 200) {
                const { token, user } = response.data;
                localStorage.setItem("authToken", token);
                localStorage.setItem("user", JSON.stringify(user));
                navigate("/");
                let text = `Good to see you again, ${user.name}! Let's get started.`;
                const voice = new SpeechSynthesisUtterance(text);
                window.speechSynthesis.speak(voice);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Log In Sucessfully",
                    showConfirmButton: false,
                    timer: 1000,
                    width: "380px",
                    height: "20px"
                });
            }
            else {
                setAlert({ severity: 'error', message: 'An error occurs' });
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Error While Login",
                    width: "380px",
                    height: "20px",
                    customClass: {
                        confirmButton: "bg-[#22C55E] text-white",
                    },
                });

            }

        } catch (error) {
            console.error('Error during login:', error);
            setAlert({ severity: 'error', message: 'Invalid Credentials' });
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Invalid Cradentials",
                width: "380px",
                height: "20px",
                customClass: {
                    confirmButton: "bg-[#22C55E] text-white",
                },
            });

        }
    };

    return (

        <div className="flex items-center justify-center h-screen w-screen">
            <div className='w-[60%] '>
                <img src={uniBg} alt="nopic" className='bg-no-repeat h-screen rounded-r-2xl' />
            </div>
            <div className='w-[40%]  flex justify-center'>
                <form
                    onSubmit={submitHandler}
                    className="w-full max-w-md p-6  shadow-2xl rounded-lg"
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
                        <div className='flex'>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button className='absolute  ml-[22rem] p-3 text-gray-500 '
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </button>
                        </div>
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
                    <Stack sx={{ width: '100%' }} spacing={2}>
                        {alert && <Alert severity={alert.severity}>{alert.message}</Alert>}
                    </Stack>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg focus:outline-none"
                    >
                        Login
                    </button>
                </form>
            </div>

        </div>
    );
};

export default Login;
