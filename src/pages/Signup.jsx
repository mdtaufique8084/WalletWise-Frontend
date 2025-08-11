import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import Input from '../components/Input';
import { validateEmail } from '../util/validation';
import axiosConfig from '../util/axiosConfig';
import { API_ENDPOINTS } from '../util/apiEndPoints';
import toast from 'react-hot-toast';
import { LoaderCircle } from 'lucide-react';
import ProfilePhotoSelector from '../components/profilePhotoSelector';
import { uploadProfileImage } from '../util/uploadProfileImage';

const Signup = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const navigate = useNavigate();

    const resetForm = () => {
        setFullName("");
        setEmail("");
        setPassword("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        let profileImageUrl="";
        if (!fullName.trim()) {
            setError("Please enter your full name");
            setIsLoading(false);
            return;
        }
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

        try {
            // Upload profile image if selected
            if(profilePhoto){
                const imageUrl = await uploadProfileImage(profilePhoto);
                profileImageUrl = imageUrl || "";
            }
            const response = await axiosConfig.post(API_ENDPOINTS.REGISTER, {
                fullName,
                email,
                password,
                profileImageUrl
            });
            if (response.status === 201) {
                toast.success("Profile Created Successfully");
                resetForm();
                navigate("/login");
            }
        } catch (err) {
            console.error('Something went wrong', err);
            toast.error(err.response?.data?.message || "Signup failed. Please try again.");
            setError(err.response?.data?.message);
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
            <div className="relative z-10 w-full max-w-lg px-6">
                <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-2xl font-semibold text-black text-center mb-2">
                        Create An Account
                    </h3>
                    <p className="text-sm text-slate-700 text-center mb-8">
                        Start tracking your spendings by joining with us.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex justify-center mb-6">
                            {/* Profile image placeholder */}
                            <ProfilePhotoSelector image={profilePhoto} setImage={setProfilePhoto} />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                            <Input
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                label="Full Name"
                                placeholder="Full Name"
                            />
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                label="Email"
                                placeholder="Email"
                            />
                            <div className="col-span-2">
                                <Input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    label="Password"
                                    placeholder="Password"
                                    type="password"
                                />
                            </div>
                        </div>
                        {error && (
                            <p className="text-red-800 text-sm text-center bg-red-50 p-2 rounded">
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
                                    Signing Up...
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </button>

                        <p className="text-sm text-slate-700 text-center mt-4">
                            Already have an account?{" "}
                            <a href="/login" className="text-blue-500 hover:underline cursor-pointer">
                                Log in
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
