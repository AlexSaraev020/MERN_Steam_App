import { ReactComponent as SvgIcon } from '../../icons/pixel.svg';
import { useState, useEffect } from 'react';
import { UserProps } from '../../types/types';
import { Link } from 'react-router-dom';
import SearchInput from './SearchInput';

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
        <nav className='flex items-center justify-center w-full p-2 sm:p-4 bg-black bg-opacity-50 z-50 relative h-[70px]'>
            <Link to="/home" className="flex items-end space-x-1 absolute left-4 top-4">
                <SvgIcon className='h-8 w-8 sm:h-10 sm:w-10' />
                <h2 className='text-white text-lg sm:text-2xl md:text-3xl font-bold'>Gamers<span className="text-emerald-400">Lobby</span></h2>
            </Link>
            <SearchInput />
                <h2 className='text-emerald-400 text-sm sm:text-lg md:text-2xl font-bold absolute right-4 top-6'>
                    <span className="text-white text-xs sm:text-base md:text-xl">Welcome, </span>{storedUsername}
                </h2>
            
        </nav>
    );
}

export default Nav;
