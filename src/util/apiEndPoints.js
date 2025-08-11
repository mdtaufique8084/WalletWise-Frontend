export const BASE_URL="http://localhost:9090/api/v1.0";
const CLOUDINARY_CLOUD_NAME="dr45so6sw";
export const API_ENDPOINTS={
    LOGIN:"/profile/login",
    REGISTER:"/profile/register",
    UPLOAD_IMAGE:`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
}