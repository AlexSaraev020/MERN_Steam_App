import React, { useEffect, useRef, useState } from 'react'
import { useUser } from '../../contexts/UserContext'

import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { useThemes } from '../../contexts/ThemeContext';
import { useGames } from '../../contexts/GamesContext';
import { ReactComponent as Close } from '../../icons/close.svg';
import { ReactComponent as Minimize } from '../../icons/minimize.svg';
import { ReactComponent as Maximize } from '../../icons/maximize.svg';
import windows from '../../images/windows2.webp'
import { deleteUser, getFavorite, updateUser } from '../../actions/apiRequests';
import { Arrows } from './profilePageComponents/Arrows';
import { FormTextContent } from './profilePageComponents/FormTextContent';
import Recommended from '../homepage/recommended/Recommended';
import { XboxButtons } from './profilePageComponents/XboxButtons';
import { SuccessAlert } from '../errorAlerts/SuccessAlert';

const ProfilePage = () => {
    const { user, userId, setUser } = useUser()
    const [description, setDescription] = useState<string | undefined>(user?.description)
    const [email, setEmail] = useState<string | undefined>(user?.email)
    const [password, setPassword] = useState<string | undefined>(undefined)
    const [name, setName] = useState<string | undefined>(user?.name)
    const [edit, setEdit] = useState<boolean>(false)
    const [showPass, setShowPass] = useState<boolean>(false)
    const { theme } = useThemes()
    const { favoriteGames, gamesData, setFavoriteGames } = useGames()
    const navigate = useNavigate()
    const [close, setClose] = useState<boolean>(false)
    const [error, setError] = useState<string | undefined>(undefined)
    const [message, setMessage] = useState<string | undefined>(undefined);

    useEffect(() => {
        const token = Cookies.get('token')
        if (!token) {
            navigate('/')
        }
    })

    const handleEdit = () => {
        setEdit(!edit);
        setEmail(user?.email);
        setName(user?.name);
        setEmail(user?.email);
        setDescription(user?.description);
    }

    useEffect(() => {
        const getFavoriteGames = async () => {
            try {
                await getFavorite({ userId, gamesData, setFavoriteGames });
            } catch (error) {
                console.error(error)
            }
        }
        getFavoriteGames()
    }, [gamesData?.popular, setFavoriteGames, userId]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await updateUser({ userId, name, email, password, description, setUser, setEdit, edit ,setMessage,setClose})
    }

    const handleDelete = async () => {
        await deleteUser({ userId, setUser, navigate })
    }

    return (
        <div className={`w-full min-h-[80vh] pt-10 lg:mt-0 lg:min-h-[70vh] flex text-white justify-center transition-all duration-500 ease-in-out animate-fadeIn`}>
            <div className={` w-11/12 h-fit rounded-xl py-10 bg-[rgb(30,30,30)]`}>
                <form onSubmit={handleSubmit} className='flex flex-col lg:py-4 items-center justify-center'>
                    <div className={`relative px-4 flex flex-col lg:flex-row justify-center bg-zinc-800 w-11/12 lg:w-10/12 lg:space-x-4 rounded-3xl h-auto border shadow-glow shadow-${theme}-500 border-${theme}-500 py-2 flex flex-row lg:flex-row items-center justify-center transition-all duration-500`}>
                        <div className='hidden lg:block'>
                            <Arrows theme={theme} />
                        </div>
                        <div className='bg-neutral-950 rounded-xl justify-between w-full lg:w-8/12 xl:w-9/12 min-h-[20rem] p-4 relative flex flex-col items-center'>
                            <img src={windows} alt="windows" className='absolute rounded-xl z-0 inset-0 w-full h-full object-cover' />
                            <div className={`h-full bg-black  ${!edit ? 'w-full md:w-9/12' : 'w-full'} relative z-10 transition-all duration-500 ease-in-out animate-fadeIn`}>
                                <div className='w-full bg-white flex justify-end items-center'>
                                    <span className='text-black hover:bg-blue-400'><Minimize className='w-5 h-5' /></span>
                                    <span className='text-black hover:bg-blue-400'><Maximize className='w-5 h-5' /></span>
                                    <span className='text-black hover:bg-red-500'><Close className='w-5 h-5' /></span>
                                </div>
                                <FormTextContent
                                    edit={edit}
                                    name={name}
                                    email={email}
                                    description={description}
                                    user={user} theme={theme}
                                    favoriteGames={favoriteGames}
                                    showPass={showPass}
                                    setShowPass={setShowPass}
                                    setName={setName}
                                    setDescription={setDescription}
                                    setEmail={setEmail}
                                    setPassword={setPassword}
                                    handleDelete={handleDelete}
                                    handleEdit={handleEdit}
                                />
                            </div>
                        </div>
                        <div className='hidden lg:block'>
                            <XboxButtons theme={theme} />
                        </div>
                        <div className='lg:hidden flex h-28 w-full relative'>
                            <div className='absolute left-0 block lg:hidden sm:left-10 md:left-32 top-4 items-center justify-center'>
                                <Arrows theme={theme} />
                            </div>
                            <div className='absolute right-0 sm:right-10 md:right-32 top-4 flex items-center justify-center'>
                                <XboxButtons theme={theme} />
                            </div>
                        </div>
                    </div>
                    <div className='w-full flex items-center justify-center'>
                        <div className='w-11/12 lg:w-10/12 mt-10' >
                            <SuccessAlert message={message} close={close} setClose={setClose} />
                        </div>
                        <Recommended categoryName={'Your favorite games'} theme={theme} gamesData={favoriteGames} />
                    </div>
                </form>
            </div>
        </div>
    )
}
export default ProfilePage