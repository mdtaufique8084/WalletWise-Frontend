import { Trash, Upload, User } from "lucide-react";
import React, { useRef, useState } from "react";

const ProfilePhotoSelector = ({ image, setImage }) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    };

    const handleRemoveImage = (e) => {
        e.preventDefault();
        setImage(null);
        setPreviewUrl(null);
    };

    const onFileChoose = (e) => {
        e.preventDefault();
        inputRef.current?.click();
    }

    return (
        <div className="flex flex-col items-center">
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={inputRef}
                className="hidden"
            />

            {image ? (
                // Preview state
                <div className="relative">
                    <img
                        src={previewUrl}
                        alt="profile"
                        className="w-32 h-32 rounded-full object-cover border-2 border-purple-400 shadow-lg"
                    />
                    <button
                        onClick={handleRemoveImage}
                        className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition"
                    >
                        <Trash className="text-red-500" size={16} />
                    </button>
                </div>
            ) : (
                // Upload state
                <div
                    onClick={ onFileChoose}
                    className="cursor-pointer border-2 border-dashed border-gray-300 rounded-full w-32 h-32 flex flex-col items-center justify-center hover:border-purple-400 transition"
                >
                    <User className="text-purple-400 mb-1" size={40} />
                    <Upload size={18} className="text-purple-500" />
                    <span className="text-xs text-gray-500 mt-1">Upload Photo</span>
                </div>
            )}
        </div>
    );
};

export default ProfilePhotoSelector;
