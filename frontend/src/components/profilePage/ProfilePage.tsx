import React, { useEffect, useRef, useState } from 'react'
import { useUser } from '../../contexts/UserContext'
import axios from 'axios';
import { ReactComponent as Hide } from '../../icons/hide.svg';
import { ReactComponent as Unhide } from '../../icons/unhide.svg';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { useThemes } from '../../contexts/ThemeContext';
import { useGames } from '../../contexts/GamesContext';
import { ReactComponent as Close } from '../../icons/close.svg';
import { ReactComponent as Minimize } from '../../icons/minimize.svg';
import { ReactComponent as Maximize } from '../../icons/maximize.svg';

import windows from '../../images/windows2.jpg'

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
    const [scrollDirection, setScrollDirection] = useState<'right' | 'left'>('right');
    const scrollRef = useRef<HTMLDivElement>(null);

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
        const getFavorite = async () => {
            try {
                if (userId) {
                    const response = await axios.get(`https://gamerslobby-api.onrender.com/user/${userId}`);
                    if (response.status === 200) {
                        const favoriteGameIds = response.data.userFavorite;
                        if (gamesData?.popular) {
                            setFavoriteGames(gamesData.popular.filter((game) => favoriteGameIds.includes(game.id)));
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching favorite games:', error);
            }
        };
        getFavorite();
    }, [gamesData?.popular, setFavoriteGames, userId]);

    useEffect(() => {
        const scrollHandler = () => {
            if (favoriteGames.length >= 3) {
                if (scrollRef.current) {
                    const container = scrollRef.current;
                    if (scrollDirection === 'right') {
                        container.scrollLeft += 1;
                        if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
                            setScrollDirection('left');
                        }
                    } else {
                        container.scrollLeft -= 1;
                        if (container.scrollLeft <= 0) {
                            setScrollDirection('right');
                        }
                    }
                }
            }

        };

        const interval = setInterval(scrollHandler, 20);

        return () => clearInterval(interval);
    }, [scrollDirection]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await axios.put('https://gamerslobby-api.onrender.com/userUpdate', {
                userId: userId,
                userName: name,
                userEmail: email,
                userPassword: password,
                userDescription: description,
            });

            if (response.status === 200) {
                setUser(response.data)
            }

            setEdit(!edit);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }

    const handleDelete = async () => {
        const response = await axios.delete(`https://gamerslobby-api.onrender.com/deleteUser/${userId}`)

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

    return (
        <div className={`w-full min-h-[80vh] pt-10 lg:mt-0 lg:min-h-[70vh] flex text-white justify-center transition-all duration-500 ease-in-out animate-fadeIn`}>
            <div className={` w-11/12 h-fit rounded-xl py-10 bg-[rgb(30,30,30)]`}>
                <form onSubmit={handleSubmit} className='flex flex-col lg:py-4 items-center justify-center'>
                    <div className={`relative px-4 flex flex-col lg:flex-row justify-center bg-zinc-800 w-11/12 lg:w-10/12 lg:space-x-4 rounded-3xl h-auto border shadow-glow shadow-${theme}-500 border-${theme}-500 py-2 flex flex-row lg:flex-row items-center justify-center transition-all duration-500`}>
                        <div className={`bg-black text-zinc-500 hidden lg:block lg:w-32 lg:h-32 xl:w-36 xl:h-36 relative rounded-full border-2 border-${theme}-500 shadow-glow-sm shadow-${theme}-500`}>
                            <div className="triangle-right hover:cursor-pointer hover:scale-125 transition-all duration-500 absolute top-1/2 right-3 transform -translate-y-1/2" />
                            <div className="triangle-up hover:cursor-pointer hover:scale-125 transition-all duration-500 absolute top-3 left-1/2 transform -translate-x-1/2" />
                            <div className="triangle-left hover:cursor-pointer hover:scale-125 transition-all duration-500 absolute top-1/2 left-3 transform -translate-y-1/2" />
                            <div className="triangle-down hover:cursor-pointer hover:scale-125 transition-all duration-500 absolute bottom-3 left-1/2 transform -translate-x-1/2" />
                        </div>
                        <div className='bg-neutral-950 rounded-xl justify-between w-full lg:w-8/12 xl:w-9/12 min-h-[20rem] p-4 relative flex flex-col items-center'>
                            <img src={windows} alt="windows" className='absolute rounded-xl z-0 inset-0 w-full h-full object-cover' />
                            <div className={`h-full bg-black  ${!edit ? 'w-full md:w-9/12' : 'w-full'} relative z-10 transition-all duration-500 ease-in-out animate-fadeIn`}>
                                <div className='w-full bg-white flex justify-end items-center'>
                                    <span className='text-black hover:bg-blue-400'><Minimize className='w-5 h-5' /></span>
                                    <span className='text-black hover:bg-blue-400'><Maximize className='w-5 h-5' /></span>
                                    <span className='text-black hover:bg-red-500'><Close className='w-5 h-5' /></span>
                                </div>
                                <div className='flex flex-col w-full justify-between min-h-80'>
                                    <div className='w-full px-2'>
                                        {edit ? (
                                            <div className='w-full'>
                                                <label htmlFor="username" className={`flex font-mono text-sm sm:text-lg font-medium mb-1 text-white ml-1`}>
                                                    Change username
                                                </label>
                                                <input
                                                    id='username'
                                                    maxLength={30}
                                                    className={`mt-1 p-2 w-full text-sm sm:text-md transition-all duration-500 border-zinc-400 border rounded-md mb-5 bg-zinc-800/50 font-semibold text-${theme}-text focus:border-${theme}-500 placeholder-${theme}-text placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-${theme}-400 ease-in-out animate-fadeIn`}
                                                    value={name}
                                                    type='text'
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                            </div>
                                        ) : (
                                            <div className='w-full mb-2'>
                                                <h2 className='text-sm sm:text-md text-yellow-200 font-mono'>$npm  <span className='text-gray-300'>init {user?.name} </span> <span className='animate-blink transition-opacity duration-0'>_</span></h2>
                                            </div>
                                        )}
                                        {edit ? (
                                            <div className='w-full'>
                                                <label htmlFor="description" className={`flex text-sm sm:text-lg font-mono font-medium mb-1 text-white ml-1`}>
                                                    Change description
                                                </label>
                                                <textarea id='description' onChange={(e) => setDescription(e.target.value)} value={description} className={`max-h-40 mt-1 p-2 w-full text-sm sm:text-md transition-all duration-500 border-${theme}-border border rounded-md bg-zinc-800/50 font-semibold text-${theme}-text focus:border-${theme}-500 placeholder-${theme}-text placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-${theme}-400 ease-in-out animate-fadeIn`} />
                                            </div>
                                        ) : (
                                            <div className='w-full space-y-2'>
                                                <p className='text-xs sm:text-md text-zinc-400 font-mono w-full'>
                                                    Player's description: {user?.description ? user.description : 'Write a description...'}
                                                </p>
                                                <div className={`font-mono text-xs min-[320px]:text-sm sm:text-md flex`}>
                                                    <h2 className='text-zinc-300 flex flex-wrap w-fit'><span className='text-yellow-200'>$npm</span>&nbsp;i Total_favorite_games: <span className='text-yellow-300'>&nbsp;{favoriteGames.length}</span></h2>
                                                </div>
                                            </div>
                                        )}

                                        {edit && (
                                            <div className='w-full ease-in-out animate-fadeIn transition-all duration-500'>
                                                <label htmlFor="email" className={`flex font-mono text-sm sm:text-lg font-medium text-${theme}-text-alt ml-1`}>
                                                    Email
                                                </label>
                                                <input
                                                    autoComplete="email"
                                                    type="email"
                                                    id="email"
                                                    value={email}
                                                    name="email"
                                                    className={`mt-1 p-2 w-full text-sm font-mono sm:text-md transition-all duration-500 border-${theme}-border border rounded-md mb-5 bg-zinc-800/50 font-semibold text-${theme}-text focus:border-${theme}-500 placeholder-${theme}-text placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-${theme}-400`}
                                                    placeholder="Enter your email"
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                        )}
                                        {edit && (
                                            <div className='w-full relative ease-in-out animate-fadeIn transition-all duration-500'>
                                                <label htmlFor="password" className={`flex font-mono text-sm sm:text-lg font-medium text-${theme}-text-alt ml-1`}>
                                                    Password
                                                </label>
                                                <input
                                                    autoComplete="current-password"
                                                    type={showPass ? 'text' : 'password'}
                                                    id="password"
                                                    name="password"
                                                    className={`mt-1 p-2 w-full text-sm sm:text-md font-mono transition-all duration-500 border-${theme}-border border rounded-md mb-5 bg-zinc-800/50 font-semibold text-${theme}-text focus:border-${theme}-500 placeholder-${theme}-text placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-${theme}-400`}
                                                    placeholder="●●●●●●●●"
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                                <button type='button' onClick={() => setShowPass(!showPass)} className='absolute right-0 p-2'>
                                                    {showPass ? (
                                                        <Hide className={`w-7 h-7 fill-${theme}-600 transition-opacity duration-500 ease-in-out animate-fadeIn`} />
                                                    ) : (
                                                        <Unhide className={`w-7 h-7 fill-${theme}-600 transition-opacity duration-500 ease-in-out animate-fadeIn`} />
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className='w-full mb-3 px-2 flex items-end justify-center  z-10'>
                                        <div className='flex flex-col w-9/12 sm:space-x-4 sm:flex-row sm:w-full text-xs sm:text-sm md:text-md space-y-2 sm:space-y-0 lg:space-x-4'>
                                            <button type='button' onClick={handleEdit} className={`p-3 sm:p-2 rounded-lg w-full sm:w-44 bg-zinc-900 hover:shadow-glow-sm hover:shadow-yellow-200 shadow-sm shadow-yellow-200 transition-all duration-500`}>
                                                Edit profile
                                            </button>
                                            {edit &&
                                                <button type='submit' className={`p-3 sm:p-2 rounded-lg w-full sm:w-44 bg-zinc-900 shadow-sm hover:shadow-glow-sm shadow-${theme}-600 hover:shadow-${theme}-500 text-${theme}-500 transition-all duration-500 ease-in-out animate-fadeIn`}>
                                                    Save
                                                </button>
                                            }
                                            {edit &&
                                                <button onClick={handleDelete} type='button' className={`p-3 sm:p-2 rounded-lg w-full sm:w-44 bg-zinc-900 shadow-sm hover:shadow-glow-sm shadow-red-500 hover:shadow-red-500 text-red-400 transition-all duration-500 ease-in-out animate-fadeIn`}>
                                                    Delete account
                                                </button>
                                            }

                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                        <div className={`bg-black hidden lg:block lg:w-32 lg:h-32 xl:w-36 xl:h-36 relative rounded-full border-2 border-${theme}-500 shadow-glow-sm shadow-${theme}-500`}>
                            <div className="bg-red-500 hover:cursor-pointer hover:scale-125 transition-all duration-500 h-7 w-7 rounded-full absolute top-1/2 right-2 transform -translate-y-1/2 flex items-center justify-center text-black font-bold text-xl sm:text-3xl">
                                B
                            </div>
                            <div className="bg-yellow-500 hover:cursor-pointer hover:scale-125 transition-all duration-500 h-7 w-7 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2 flex items-center justify-center text-black font-bold text-xl sm:text-3xl">
                                Y
                            </div>
                            <div className="bg-blue-500 hover:cursor-pointer hover:scale-125 transition-all duration-500 h-7 w-7 rounded-full absolute top-1/2 left-2 transform -translate-y-1/2 flex items-center justify-center text-black font-bold text-xl sm:text-3xl">
                                X
                            </div>
                            <div className="bg-green-500 hover:cursor-pointer hover:scale-125 transition-all duration-500 h-7 w-7 rounded-full absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center justify-center text-black font-bold text-xl sm:text-3xl">
                                A
                            </div>
                        </div>
                        <div className='lg:hidden flex h-28 w-full relative'>
                            <div className='absolute left-0 sm:left-10 md:left-32 top-4 flex items-center justify-center'>
                                <div className={`bg-black block w-20 h-20 min-[400px]:w-24 min-[400px]:h-24  relative rounded-full text-${theme}-400 border-2 border-${theme}-500 shadow-glow-sm shadow-${theme}-500`}>
                                    <div className=" hover:cursor-pointer hover:scale-125 transition-all duration-500 h-6 w-6 rounded-full absolute top-1/2 right-1 transform -translate-y-1/2 flex items-center justify-center font-bold text-md sm:text-2xl">
                                        ▶
                                    </div>
                                    <div className="hover:cursor-pointer hover:scale-125 transition-all duration-500 h-6 w-6 rounded-full absolute top-1 left-1/2 transform -translate-x-1/2 flex items-center justify-center font-bold text-md sm:text-2xl">
                                        ▲
                                    </div>
                                    <div className="hover:cursor-pointer hover:scale-125 transition-all duration-500 h-6 w-6 rounded-full absolute top-1/2 left-1 transform -translate-y-1/2 flex items-center justify-center font-bold text-md sm:text-2xl">
                                        ◀
                                    </div>
                                    <div className="hover:cursor-pointer hover:scale-125 transition-all duration-500 h-6 w-6 rounded-full absolute bottom-1 left-1/2 transform -translate-x-1/2 flex items-center justify-center font-bold text-md sm:text-2xl">
                                        ▼
                                    </div>
                                </div>
                            </div>
                            <div className='absolute right-0 sm:right-10 md:right-32 top-4 flex items-center justify-center'>
                                <div className={`bg-black block w-20 h-20 min-[400px]:w-24 min-[400px]:h-24 relative rounded-full border-2 border-${theme}-500 shadow-glow-sm shadow-${theme}-500`}>
                                    <div className="bg-red-500 hover:cursor-pointer hover:scale-125 transition-all duration-500 h-6 w-6 rounded-full absolute top-1/2 right-1 transform -translate-y-1/2 flex items-center justify-center text-black font-bold text-xl">
                                        B
                                    </div>
                                    <div className="bg-yellow-500 hover:cursor-pointer hover:scale-125 transition-all duration-500 h-6 w-6 rounded-full absolute top-1 left-1/2 transform -translate-x-1/2 flex items-center justify-center text-black font-bold text-xl">
                                        Y
                                    </div>
                                    <div className="bg-blue-500 hover:cursor-pointer hover:scale-125 transition-all duration-500 h-6 w-6 rounded-full absolute top-1/2 left-1 transform -translate-y-1/2 flex items-center justify-center text-black font-bold text-xl">
                                        X
                                    </div>
                                    <div className="bg-green-500 hover:cursor-pointer hover:scale-125 transition-all duration-500 h-6 w-6 rounded-full absolute bottom-1 left-1/2 transform -translate-x-1/2 flex items-center justify-center text-black font-bold text-xl">
                                        A
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    {favoriteGames.length > 0 &&
                        <section className={`relative flex flex-col items-center justify-center w-full mt-10 md:mb-10`}>
                            <h2 className={`font-mono relative w-fit h-auto py-4 justify-center flex text-${theme}-400 text-2xl xl:text-5xl font-extrabold text-center select-auto`}>
                                Your favorite games
                            </h2>
                            <div className={`flex relative items-center justify-center w-full md:space-x-4`}>
                                <div ref={scrollRef} className={`w-11/12 md:w-10/12 lg:w-10/12 xl:w-11/12 items-center flex lg:scrollbar-thin scrollbar-thumb-${theme}-500 scrollbar-track-zinc-800 overflow-x-scroll space-x-4 py-14 px-9`}>
                                    {favoriteGames.slice(0, 20).map((game) => (
                                        <Link
                                            to={`/game/${game.id}`}
                                            key={game.id}
                                            className={`relative flex-none w-full md:w-6/12 lg:w-6/12 xl:w-6/12 hover:border-2 hover:border-${theme}-500 hover:shadow-glow hover:shadow-${theme}-500 transition-all duration-500 hover:z-10 hover:-translate-y-6 hover:scale-105 rounded-2xl`}
                                        >
                                            <div className={`relative w-full flex flex-col justify-end overflow-hidden h-36 sm:h-48 md:h-56 lg:h-56 xl:h-72 rounded-2xl p-2`}>
                                                <img src={game.thumbnail} alt={game.title} className={`absolute inset-0 h-full w-full object-cover`} />
                                                <div className={`absolute inset-0 bg-gradient-to-t from-zinc-950 via-gray-900/40`}></div>
                                                <h3 className={`z-10 mt-3 text-lg font-bold text-white truncate`}>{game.title}</h3>
                                                <div className={`z-10 gap-y-1 overflow-hidden text-sm leading-6 text-gray-300`}>{game.genre}</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </section>

                    }


                </form>
            </div>
        </div>
    )
}
export default ProfilePage