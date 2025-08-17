export const BASE_URL="http://localhost:9090/api/v1.0";
const CLOUDINARY_CLOUD_NAME="dr45so6sw";
export const API_ENDPOINTS={
    LOGIN:"/profile/login",
    REGISTER:"/profile/register",
    GET_USER_PROFILE:`/profile/user`,
    UPLOAD_IMAGE:`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    GET_ALL_CATEGORIES:`/category/allCategories`,
    UPDATE_CATEGORY:(categoryId) => `/category/updateCategory/${categoryId}`,
    DELETE_CATEGORY:(categoryId) => `/category/deleteCategory/${categoryId}`,
    ADD_CATEGORY:`/category/addCategory`
}