import {v2 as cloudinary} from "cloudinary"

const connectCloudinary = async() => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARITY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARITY_API_KEY,
        api_secret: process.env.CLOUDINARITY_API_SECRET,
    })
}

export default connectCloudinary;