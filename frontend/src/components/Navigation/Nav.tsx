import { ReactComponent as SvgIcon } from '../../icons/pixel.svg';
import { useState, useEffect } from 'react';
import { UserProps } from '../../types/types';

const Nav: React.FC<UserProps> = ({ username }) => {
    const [storedUsername, setStoredUsername] = useState<string>('');

    useEffect(() => {
        const savedUsername = localStorage.getItem('username') || 'Guest';
        setStoredUsername(savedUsername);
    }, []);

    useEffect(() => {
        if (username) {
            localStorage.setItem('username', username);
            setStoredUsername(username);
        }
    }, [username]);

    return (
        <nav className='flex w-full justify-between p-2 sm:p-4 bg-black bg-opacity-50 z-50'>
            <div className="flex items-center">
                <SvgIcon className='h-8 w-8 sm:h-10 sm:w-10' />
                <h2 className='text-white text-lg sm:text-2xl md:text-3xl font-bold ml-2'>Gamers<span className="text-blue-400">Lobby</span></h2>
            </div>
            <div className="flex space-x-2 sm:space-x-4 md:space-x-8 items-center">
                <div className="relative text-gray-600 max-md:hidden">
                    <input type="search" name="search" placeholder="Search" className="bg-white h-8 sm:h-8 px-4 sm:px-5 pr-8 sm:pr-10 rounded-full text-xs sm:text-sm focus:outline-none flex items-center justify-center" />
                    <button type="submit" className="absolute right-0 top-[10px] mr-2 sm:mr-4">
                        <svg className="h-2 w-2 sm:h-3 sm:w-3 fill-current" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 56.966 56.966" xmlSpace="preserve" width="512px" height="512px">
                            <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                        </svg>
                    </button>
                </div>
                <h2 className='text-indigo-200 text-sm sm:text-lg md:text-2xl font-bold'>
                    <span className="text-white text-xs sm:text-base md:text-xl">Welcome, </span>{storedUsername}
                </h2>
            </div>
        </nav>
    );
}

export default Nav;
