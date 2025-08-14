import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import Input from "../components/Input";
import { validateEmail } from "../util/validation";
import { AppContext } from "../context/AppContext";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndPoints";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { setUser } = useContext(AppContext);
    const navigate = useNavigate();

    const resetForm = () => {
        setEmail("");
        setPassword("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // ✅ Basic validations
        if (!validateEmail(email)) {
            setError("Please enter a valid email");
            setIsLoading(false);
            return;
        }
        if (!password.trim()) {
            setError("Please enter your password");
            setIsLoading(false);
            return;
        }
        setError(null);

        // ✅ Login API call
        try {
            const response = await axiosConfig.post(API_ENDPOINTS.LOGIN, {
                email,
                password
            });

            const { token, user } = response.data;

            if (token) {
                localStorage.setItem("token", token);
                setUser(user);
            }

            if (response.status === 200) {
                toast.success("Login Successful");
                resetForm();
                navigate("/dashboard");
            }
        } catch (err) {
            console.error("Login error:", err);
            const errMsg = err.response?.data?.message || "Login failed. Please try again.";
            toast.error(errMsg);
            setError(errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
            {/* Background image */}
            <img
                src={assets.login_bg}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover filter blur-sm"
            />

            {/* Login card */}
            <div className="relative z-10 w-full max-w-md px-6">
                <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-3xl font-bold text-gray-900 text-center mb-2">
                        Welcome Back
                    </h3>
                    <p className="text-sm text-gray-600 text-center mb-8">
                        Please enter your credentials to access your account.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            value={email}
                            onChange={(val) => setEmail(val)} 
                            label="Email"
                            placeholder="Enter your email"
                            type="text"
                        />
                        <Input
                            value={password}
                            onChange={(val) => setPassword(val)} 
                            label="Password"
                            placeholder="Enter your password"
                            type="password"
                        />

                        {error && (
                            <p className="text-red-700 text-sm text-center bg-red-50 p-2 rounded-md border border-red-200">
                                {error}
                            </p>
                        )}

                        <button
                            disabled={isLoading}
                            type="submit"
                            className={`w-full flex items-center justify-center gap-2 py-2 text-lg font-medium rounded-lg 
                                ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} 
                                text-white transition-colors duration-200`}
                        >
                            {isLoading ? (
                                <>
                                    <LoaderCircle className="animate-spin h-5 w-5" />
                                    Logging in...
                                </>
                            ) : (
                                "Log In"
                            )}
                        </button>

                        <p className="text-sm text-gray-600 text-center mt-4">
                            Don't have an account?{" "}
                            <a
                                href="/signup"
                                className="text-blue-500 font-medium hover:underline"
                            >
                                Sign up
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
