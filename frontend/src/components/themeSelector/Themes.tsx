import React, { useState } from 'react';
import { useThemes } from '../../contexts/ThemeContext';

const Themes = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, setTheme } = useThemes();

    const themes = [
        { id: 1, bg: 'bg-emerald-400 bg-emerald-500 bg-emerald-600', shadow: 'shadow-emerald-400 shadow-emerald-500 shadow-emerald-600', hoverShadow: 'hover:shadow-emerald-400 hover:shadow-emerald-500 hover:shadow-emerald-600', text: 'text-emerald-400 text-emerald-500 text-emerald-600', border: 'border-emerald-400 border-emerald-500 border-emerald-600', hoverBorder: 'hover:border-emerald-400 hover:border-emerald-500 hover:border-emerald-600', fill: 'fill-emerald-400 fill-emerald-500 fill-emerald-600', stroke: 'stroke-emerald-400 stroke-emerald-500 stroke-emerald-600', focusBorder: 'focus:border-emerald-400 focus:border-emerald-500 focus:border-emerald-600', focusRing: 'focus:ring-emerald-400 focus:ring-emerald-500 focus:ring-emerald-600', scrollbarThumb: 'scrollbar-thumb-emerald-500', colorName: 'emerald' },
        { id: 2, bg: 'bg-red-400 bg-red-500 bg-red-600', shadow: 'shadow-red-400 shadow-red-500 shadow-red-600', hoverShadow: 'hover:shadow-red-400 hover:shadow-red-500 hover:shadow-red-600', text: 'text-red-400 text-red-500 text-red-600', border: 'border-red-400 border-red-500 border-red-600', hoverBorder: 'hover:border-red-400 hover:border-red-500 hover:border-red-600', fill: 'fill-red-400 fill-red-500 fill-red-600', stroke: 'stroke-red-400 stroke-red-500 stroke-red-600', focusBorder: 'focus:border-red-400 focus:border-red-500 focus:border-red-600', focusRing: 'focus:ring-red-400 focus:ring-red-500 focus:ring-red-600', scrollbarThumb: 'scrollbar-thumb-red-500', colorName: 'red' },
        { id: 3, bg: 'bg-orange-400 bg-orange-500 bg-orange-600', shadow: 'shadow-orange-400 shadow-orange-500 shadow-orange-600', hoverShadow: 'hover:shadow-orange-400 hover:shadow-orange-500 hover:shadow-orange-600', text: 'text-orange-400 text-orange-500 text-orange-600', border: 'border-orange-400 border-orange-500 border-orange-600', hoverBorder: 'hover:border-orange-400 hover:border-orange-500 hover:border-orange-600', fill: 'fill-orange-400 fill-orange-500 fill-orange-600', stroke: 'stroke-orange-400 stroke-orange-500 stroke-orange-600', focusBorder: 'focus:border-orange-400 focus:border-orange-500 focus:border-orange-600', focusRing: 'focus:ring-orange-400 focus:ring-orange-500 focus:ring-orange-600', scrollbarThumb: 'scrollbar-thumb-orange-500', colorName: 'orange' },
        { id: 4, bg: 'bg-sky-400 bg-sky-500 bg-sky-600', shadow: 'shadow-sky-400 shadow-sky-500 shadow-sky-600', hoverShadow: 'hover:shadow-sky-400 hover:shadow-sky-500 hover:shadow-sky-600', text: 'text-sky-400 text-sky-500 text-sky-600', border: 'border-sky-400 border-sky-500 border-sky-600', hoverBorder: 'hover:border-sky-400 hover:border-sky-500 hover:border-sky-600', fill: 'fill-sky-400 fill-sky-500 fill-sky-600', stroke: 'stroke-sky-400 stroke-sky-500 stroke-sky-600', focusBorder: 'focus:border-sky-400 focus:border-sky-500 focus:border-sky-600', focusRing: 'focus:ring-sky-400 focus:ring-sky-500 focus:ring-sky-600', scrollbarThumb: 'scrollbar-thumb-sky-500', colorName: 'sky' },
        { id: 5, bg: 'bg-violet-400 bg-violet-500 bg-violet-600', shadow: 'shadow-violet-400 shadow-violet-500 shadow-violet-600', hoverShadow: 'hover:shadow-violet-400 hover:shadow-violet-500 hover:shadow-violet-600', text: 'text-violet-400 text-violet-500 text-violet-600', border: 'border-violet-400 border-violet-500 border-violet-600', hoverBorder: 'hover:border-violet-400 hover:border-violet-500 hover:border-violet-600', fill: 'fill-violet-400 fill-violet-500 fill-violet-600', stroke: 'stroke-violet-400 stroke-violet-500 stroke-violet-600', focusBorder: 'focus:border-violet-400 focus:border-violet-500 focus:border-violet-600', focusRing: 'focus:ring-violet-400 focus:ring-violet-500 focus:ring-violet-600', scrollbarThumb: 'scrollbar-thumb-violet-500', colorName: 'violet' },
        { id: 6, bg: 'bg-pink-400 bg-pink-500 bg-pink-600', shadow: 'shadow-pink-400 shadow-pink-500 shadow-pink-600', hoverShadow: 'hover:shadow-pink-400 hover:shadow-pink-500 hover:shadow-pink-600', text: 'text-pink-400 text-pink-500 text-pink-600', border: 'border-pink-400 border-pink-500 border-pink-600', hoverBorder: 'hover:border-pink-400 hover:border-pink-500 hover:border-pink-600', fill: 'fill-pink-400 fill-pink-500 fill-pink-600', stroke: 'stroke-pink-400 stroke-pink-500 stroke-pink-600', focusBorder: 'focus:border-pink-400 focus:border-pink-500 focus:border-pink-600', focusRing: 'focus:ring-pink-400 focus:ring-pink-500 focus:ring-pink-600', scrollbarThumb: 'scrollbar-thumb-pink-500', colorName: 'pink' },
        { id: 7, bg: 'bg-gray-400 bg-gray-500 bg-gray-600', shadow: 'shadow-gray-400 shadow-gray-500 shadow-gray-600', hoverShadow: 'hover:shadow-gray-400 hover:shadow-gray-500 hover:shadow-gray-600', text: 'text-gray-400 text-gray-500 text-gray-600', border: 'border-gray-400 border-gray-500 border-gray-600', hoverBorder: 'hover:border-gray-400 hover:border-gray-500 hover:border-gray-600', fill: 'fill-gray-400 fill-gray-500 fill-gray-600', stroke: 'stroke-gray-400 stroke-gray-500 stroke-gray-600', focusBorder: 'focus:border-gray-400 focus:border-gray-500 focus:border-gray-600', focusRing: 'focus:ring-gray-400 focus:ring-gray-500 focus:ring-gray-600', scrollbarThumb: 'scrollbar-thumb-gray-500', colorName: 'gray' }
    ];



    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleThemeChange = (chosenTheme: string) => {
        setTheme(chosenTheme);
        setIsOpen(!isOpen);
        localStorage.setItem('theme', chosenTheme);
        console.log(chosenTheme);
    };


    return (
        <div className="relative px-2 w-full flex items-center space-x-2 justify-end">
            <h2 className={`font-mono order-2 ml-2 lg:ml-0 lg:order-1 text-zinc-200 text-xl`}>
                Theme
            </h2>
            <button
                onClick={toggleDropdown}
                className={`px-4 py-4 order-1 cursor-pointer bg-${theme}-500 hover:text-${theme}-500 shadow-glow hover:scale-110 transition-all duration-500 shadow-${theme}-500 border-2 border-${theme}-500 rounded-full w-fit`}
            >
            </button>
            <div className={`absolute top-full -right-12 mt-2 bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 border-2 border-${theme}-500 shadow-glow shadow-${theme}-500 rounded-md overflow-hidden z-10 transform transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <ul className="px-4 py-2 space-y-2 flex flex-col items-start">
                    {themes.map(themeItem => (
                        <li key={themeItem.id} className={`p-2 flex transition-all hover:shadow-glow-sm border border-zinc-500 bg-gradient-to-tr from-zinc-900 via-zinc-800 to bg-zinc-900 hover:shadow-${themeItem.hoverShadow}-500 hover:border-${themeItem.hoverBorder}-500 rounded-xl items-center w-full`}>
                            <button
                                onClick={() => handleThemeChange(themeItem.colorName)}
                                className={`hover:scale-105 w-full items-center space-x-2 transition-all duration-500 text-${themeItem.text}-400 hover:text-md font-semibold font-mono flex w-fit ${themeItem.text}`}
                            >
                                <div className={`px-5 py-5 cursor-pointer ${themeItem.bg} rounded-full w-fit`}></div>
                                <h2 className='text-md text-white'>
                                    {themeItem.colorName[0].toUpperCase() + themeItem.colorName.slice(1, themeItem.colorName.length)}
                                </h2>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    );
};

export default Themes;
