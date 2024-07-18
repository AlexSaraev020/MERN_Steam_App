import React, { useEffect, useState } from 'react'
import { useUser } from '../../contexts/UserContext'
import axios from 'axios';
import userPlaceholder from '../../images/userPlaceholder.png'
import { ReactComponent as Hide } from '../../icons/hide.svg';
import { ReactComponent as Unhide } from '../../icons/unhide.svg';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const { user, userId, setUser } = useUser()
    const [description, setDescription] = useState<string | undefined>(user?.description)
    const [email, setEmail] = useState<string | undefined>(user?.email)
    const [password, setPassword] = useState<string | undefined>(undefined)
    const [name, setName] = useState<string | undefined>(user?.name)
    const [image, setImage] = useState<string | undefined>(user?.image)
    const [edit, setEdit] = useState<boolean>(false)
    const [showPass, setShowPass] = useState<boolean>(false)



    const handleEdit = () => {
        setEdit(!edit);
        setEmail(user?.email);
        setName(user?.name);
        setEmail(user?.email);
        setDescription(user?.description);
        setImage(user?.image);
    }


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await axios.put('http://localhost:3001/userUpdate', {
                userId: userId,
                userName: name,
                userEmail: email,
                userPassword: password,
                userDescription: description,
                userImage: image,
            });

            if (response.status === 200) {
                setUser(response.data)
            }

            setEdit(!edit);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const navigate = useNavigate()
    const handleDelete = async () => {
        const response = await axios.delete(`http://localhost:3001/deleteUser/${userId}`)

        if (response.status === 200) {
            console.log('Your account deleted successfully')
            Cookies.remove('token');
            localStorage.clear();
            setUser(undefined);
            setTimeout(() => {
                navigate('/login');
            }, 50);
        } else {
            console.log('Your account could not be deleted')
        }
    }

    useEffect(() => {
        console.log(image)
    }, [image])
    return (
        <div className='min-h-[70vh] w-full flex text-white justify-center mt-20'>
            <div className='min-h-full w-10/12 rounded-xl p-4 bg-[#1e1e1e]'>
                <form onSubmit={handleSubmit} className='flex flex-col p-4'>
                    <div className='flex items-center'>
                        {edit ?
                            <div className="flex items-center justify-center w-[20rem] h-[20rem]">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-full border-2 border-emerald-500 border-dashed hover:scale-105 hover:shadow-glow hover:shadow-emerald-500 rounded-lg cursor-pointer bg-inherit hover:bg-[#222222] transition-all duration-500 ease-in-out animate-fadeIn">
                                    {image ? (
                                        <img src={image} alt='Profile Pic' className='w-full h-full object-cover rounded-lg' />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                            </svg>
                                            <p className="mb-2 text-sm font-mono text-gray-500"><span className="font-semibold text-emerald-500/80">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                        </div>
                                    )}
                                    <input id="dropzone-file" type="file" className="hidden" onChange={handleImageChange} />
                                </label>
                            </div>

                            :
                            <img src={image ? image : userPlaceholder} alt='Profile Pic' className=' max-w-[20rem] max-h-[20rem] rounded-xl border-4 border-emerald-500 shadow-glow hover:scale-105 transition-all duration-500 shadow-emerald-500' />
                        }
                        <div className='relative px-10 flex font-mono items-center lg:items-start justify-normal mt-8 lg:mt-0 flex-col h-[20rem] w-7/12 p-2'>
                            {edit ?
                                <div className='w-full'>
                                    <label htmlFor="username" className="flex text-sm sm:text-lg font-medium mb-1 text-zinc-200 ml-1">
                                        Change username
                                    </label>
                                    <input
                                        id='username'
                                        className='mt-1 p-2 w-full text-sm sm:text-md transition-all duration-500 border-zinc-400 border rounded-md mb-5 bg-transparent font-semibold text-zinc-200 focus:border-emerald-500 placeholder-zinc-200 placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-emerald-400 ease-in-out animate-fadeIn'
                                        value={name}
                                        type='text'
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                :
                                <h2 className=' text-4xl  text-zinc-300 '>{user?.name}</h2>
                            }
                            {edit ?
                                <div className='w-full h-[10rem]'>
                                    <label htmlFor="description" className="flex text-sm sm:text-lg font-medium mb-1 text-zinc-200 ml-1">
                                        Change description
                                    </label>
                                    <textarea id='description' onChange={(e) => setDescription(e.target.value)} value={description} className='h-full mt-1 p-2 w-full text-sm sm:text-md transition-all duration-500 border-zinc-400 border rounded-md bg-transparent font-semibold text-zinc-200 focus:border-emerald-500 placeholder-zinc-200 placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-emerald-400 ease-in-out animate-fadeIn'>

                                    </textarea>
                                </div>

                                :
                                <p className='text-md text-zinc-400 font-mono w-9/12 break-words max-lg:truncate'>
                                    {user?.description ? user.description : 'Write a description...'}
                                </p>
                            }

                        </div>
                        <div className='h-full w-2/12 flex flex-col space-y-6 justify-center items-center'>
                            <button type='button' onClick={handleEdit} className='p-4 rounded-lg w-40 bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 shadow-md shadow-zinc-700 hover:shadow-glow hover:shadow-emerald-500 hover:text-emerald-500 transition-all duration-500 hover:scale-105'>
                                Edit profile
                            </button>
                            {edit &&
                                <button type='submit' className='p-4 rounded-lg w-40 bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 shadow-md hover:shadow-glow shadow-emerald-500/50 hover:shadow-emerald-500 text-emerald-500 transition-all duration-500 hover:scale-105 ease-in-out animate-fadeIn'>
                                    Save
                                </button>}
                        </div>
                    </div>
                    <div className='w-5/12 p-4'>
                        {edit &&
                            <div className='w-full '>
                                <label htmlFor="email" className="flex text-sm sm:text-lg font-medium  text-zinc-200 ml-1">
                                    Email
                                </label>
                                <input
                                    autoComplete="email"
                                    type="email"
                                    id="email"
                                    value={email}
                                    name="email"
                                    className="mt-1 p-2 w-full text-sm sm:text-md transition-all duration-500 border-zinc-400 border rounded-md mb-5 bg-transparent font-semibold text-zinc-200 focus:border-emerald-500 placeholder-zinc-200 placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                                    placeholder="Enter your email"
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                            </div>
                        }
                        {edit &&
                            <div className='w-full relative'>
                                <label htmlFor="password" className="flex text-sm sm:text-lg font-medium text-zinc-200 ml-1">
                                    Password
                                </label>
                                <input
                                    autoComplete="current-password"
                                    type={showPass ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    className="mt-1 p-2 w-full text-sm sm:text-md transition-all duration-500 border-zinc-400 border rounded-md mb-5 bg-transparent font-semibold text-zinc-200 focus:border-emerald-500 placeholder-zinc-200 placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                                    placeholder="●●●●●●●●"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button type='button' onClick={() => setShowPass(!showPass)} className='absolute right-0 p-2'>
                                    {showPass ?
                                        <Hide className='w-7 h-7 fill-emerald-600 transition-opacity duration-500 ease-in-out animate-fadeIn' /> :
                                        <Unhide className='w-7 h-7 fill-zinc-600 transition-opacity duration-500 ease-in-out animate-fadeIn' />
                                    }
                                </button>
                            </div>
                        }
                        {edit &&
                            <button onClick={handleDelete} type='button' className='p-4 border-b-2 border-r-2 border-b-zinc-600 border-r-zinc-600 rounded-lg w-40 bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 shadow-md hover:shadow-glow shadow-red-500 hover:shadow-red-500 text-red-400 transition-all duration-500 hover:scale-105 ease-in-out animate-fadeIn'>
                                Delete account
                            </button>
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}
export default ProfilePage