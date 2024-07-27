import React from 'react'
import { Game, User } from '../../../types/types';
import { ReactComponent as Hide } from '../../../icons/hide.svg';
import { ReactComponent as Unhide } from '../../../icons/unhide.svg';

interface FormTextContentProps {
    edit: boolean;
    name: string | undefined;
    description: string | undefined;
    user?: User | undefined;
    theme: string;
    favoriteGames: Game[];
    email: string | undefined;
    showPass: boolean;
    setShowPass:(showPass: boolean) => void;
    setName: (name: string | undefined) => void;
    setDescription: (description: string | undefined) => void;
    setEmail: (email: string | undefined) => void;
    setPassword: (password: string | undefined) => void;
    handleDelete:()=>void;
    handleEdit:()=>void;
}

export const FormTextContent: React.FC<FormTextContentProps> = ({ edit, name,email, description, user, theme, favoriteGames,showPass,setShowPass, setName, setDescription,setEmail,setPassword , handleDelete,handleEdit }) => {
    return (
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
                        <button type='submit' className={`p-3 sm:p-2 rounded-lg w-full sm:w-44 bg-zinc-900 shadow-sm hover:shadow-glow-sm shadow-green-500 hover:shadow-green-500 text-green-500 transition-all duration-500 ease-in-out animate-fadeIn`}>
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
    )
}
