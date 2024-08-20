import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { BsPersonCircle } from 'react-icons/bs';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { getUserData, updateProfile } from "../../Redux/Slices/AuthSlice";

function EditProfile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userId = useSelector((state) => state?.auth?.data?._id);

    const [data, setData] = useState({
        previewImage: "",
        name: "",
        avatar: undefined,
        userId: userId
    });

    const [isLoading, setIsLoading] = useState(false);

    function handleImageUpload(e) {
        e.preventDefault();
        const uploadedImage = e.target.files[0];
        if (uploadedImage) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function () {
                setData({
                    ...data,
                    previewImage: this.result,
                    avatar: uploadedImage
                });
            });
        }
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        });
    }

    async function onFormSubmit(e) {
        e.preventDefault();
        console.log(data);
        if (!data.name || !data.avatar) {
            toast.error("All fields are mandatory");
            return;
        }
        if (data.name.length < 5) {
            toast.error("Name cannot be less than 5 characters");
            return;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("avatar", data.avatar);

        console.log([...formData.entries()]);

        setIsLoading(true);
        await dispatch(updateProfile([data.userId, formData]));
        await dispatch(getUserData());

        setIsLoading(false);
        navigate("/user/profile");
    }

    return (
        <HomeLayout>
            <div className="flex items-center justify-center h-[100vh]">
                <form
                    onSubmit={onFormSubmit}
                    className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-80 min-h-[26rem] shadow-[0_0_10px_black]"
                >
                    <h1 className="text-center text-2xl font-semibold">Edit profile</h1>
                    <label className="cursor-pointer" htmlFor="image_uploads">
                        {data.previewImage ? (
                            <img 
                                className="w-28 h-28 rounded-full m-auto"
                                src={data.previewImage}
                                alt="Profile Preview"
                            />
                        ) : (
                            <BsPersonCircle className="w-28 h-28 rounded-full m-auto" />
                        )}
                    </label>
                    <input 
                        onChange={handleImageUpload}
                        className="hidden"
                        type="file"
                        id="image_uploads"
                        name="image_uploads"
                        accept=".jpg, .png, .svg, .jpeg"
                    />
                    <div className="flex flex-col gap-1">
                        <label htmlFor="name" className="text-lg font-semibold">Full Name</label>
                        <input 
                            required
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Enter your name"
                            className="bg-transparent px-2 py-1 border"
                            value={data.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className={`w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 text-lg cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Updating...' : 'Update profile'}
                    </button>
                    <Link to="/user/profile">
                        <p className="link text-accent cursor-pointer flex items-center justify-center w-full gap-2">
                            <AiOutlineArrowLeft /> Go back to profile
                        </p>
                    </Link>
                </form>
            </div>
        </HomeLayout>
    );
}

export default EditProfile;
