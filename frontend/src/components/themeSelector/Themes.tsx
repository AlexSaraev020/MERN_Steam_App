import React, { useState } from 'react';
import { useThemes } from '../../contexts/ThemeContext';

const Themes = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const { theme, setTheme } = useThemes()


    const handleThemeChange = (chosenTheme: string) => {
        setTheme(chosenTheme)
    }


    return (
        <div className="relative px-2">
            <button
                onClick={toggleDropdown}
                className={`px-5 py-5 cursor-pointer bg-${theme}-500 hover:bg-emerald-400 shadow-glow shadow-emerald-500 rounded-full w-fit`}
            >
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-2  bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 border-2 border-emerald-500 shadow-glow shadow-emerald-500 rounded-md overflow-hidden z-10 transform transition-all duration-300 ease-in-out">
                    <ul className="py-1 space-y-1 w-44 flex flex-col justify-start items-start">
                        <li className='p-2'>
                            <button onClick={() => handleThemeChange('emerald')} className='hover:scale-105 transition-all duration-500 hover:text-emerald-500 hover:text-lg font-bold flex w-full items-center space-x-1 justify-center text-white'>
                                <div className="px-4 py-4  cursor-pointer bg-emerald-500 border-2 border-black rounded-full w-fit"></div>
                                <h2 className='font-mono text-md'>
                                    Theme green
                                </h2>
                            </button>
                        </li>
                        <li className='p-2'>
                            <button onClick={() => handleThemeChange('red')} className='hover:scale-105 transition-all duration-500 hover:text-red-500 hover:text-lg font-bold flex w-full items-center space-x-1 justify-center text-white'>
                                <div className="px-4 py-4  cursor-pointer bg-red-500 border-2 border-black rounded-full w-fit"></div>
                                <h2 className='font-mono text-md'>
                                    Theme red
                                </h2>
                            </button>
                        </li>
                        <li className='p-2'>
                            <button onClick={() => handleThemeChange('orange')} className='hover:scale-105 transition-all duration-500 hover:text-orange-500 hover:text-lg font-bold flex w-full items-center space-x-1 justify-center text-white'>
                                <div className="px-4 py-4  cursor-pointer bg-orange-500 border-2 border-black rounded-full w-fit"></div>
                                <h2 className='font-mono text-md'>
                                    Theme orange
                                </h2>
                            </button>
                        </li>
                        <li className='p-2'>
                            <button onClick={() => handleThemeChange('yellow')} className='hover:scale-105 transition-all duration-500 hover:text-yellow-500 hover:text-lg font-bold flex w-full items-center space-x-1 justify-center text-white'>
                                <div className="px-4 py-4  cursor-pointer bg-yellow-500 border-2 border-black rounded-full w-fit"></div>
                                <h2 className='font-mono text-md'>
                                    Theme yellow
                                </h2>
                            </button>
                        </li>
                        <li className='p-2'>
                            <button onClick={() => handleThemeChange('sky')} className='hover:scale-105 transition-all duration-500 hover:text-sky-500 hover:text-lg font-bold flex w-full items-center space-x-1 justify-center text-white'>
                                <div className="px-4 py-4  cursor-pointer bg-sky-500 border-2 border-black rounded-full w-fit"></div>
                                <h2 className='font-mono text-md'>
                                    Theme sky
                                </h2>
                            </button>
                        </li>
                        <li className='p-2'>
                            <button onClick={() => handleThemeChange('violet')} className='hover:scale-105 transition-all duration-500 hover:text-violet-500 hover:text-lg font-bold flex w-full items-center space-x-1 justify-center text-white'>
                                <div className="px-4 py-4  cursor-pointer bg-violet-500 border-2 border-black rounded-full w-fit"></div>
                                <h2 className='font-mono text-md'>
                                    Theme violet
                                </h2>
                            </button>
                        </li>
                        <li className='p-2'>
                            <button onClick={() => handleThemeChange('pink')} className='hover:scale-105 transition-all duration-500 hover:text-pink-500 hover:text-lg font-bold flex w-full items-center space-x-1 justify-center text-white'>
                                <div className="px-4 py-4  cursor-pointer bg-pink-500 border-2 border-black rounded-full w-fit"></div>
                                <h2 className='font-mono text-md'>
                                    Theme pink
                                </h2>
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Themes;
