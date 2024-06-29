import { ReactComponent as SvgIcon } from '../../icons/pixel.svg';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchInput from './SearchInput';
import Hamburger from './Hamburger';
import NavigationMenu from './NavigationMenu';
import { jwtDecode } from 'jwt-decode';

const Nav: React.FC = () => {
    const [isMenuActive, setIsMenuActive] = useState(false);
    const [username, setUsername] = useState<string | null>(null);



    useEffect(() => {
        if (isMenuActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isMenuActive]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMenuActive(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const fetchUsername = () => {
            const token = localStorage.getItem('token');
            
            if (token) {
                try {
                    const decodedToken: any = jwtDecode(token);
                    console.log(decodedToken)
                    setUsername(decodedToken.userName);
                } catch (error) {
                    console.error('Error decoding JWT:', error);
                }
            }
        };
    
        fetchUsername();
    }, []);

    const handleClick = () => {
        setIsMenuActive(!isMenuActive);
    };
    return (
        <nav className=''>
            <div className={`flex items-center justify-center w-full p-2 sm:p-10 bg-black bg-opacity-50 z-40 ${!isMenuActive ? 'relative' : 'absolute'} h-[70px]`}>
                <Link to="/home" className="flex items-end space-x-1 absolute left-4 top-4">
                    <SvgIcon className='h-8 w-8 sm:h-10 sm:w-10' />
                    <h2 className='text-white text-lg sm:text-2xl md:text-3xl font-bold'>Gamers<span className="text-emerald-400">Lobby</span></h2>
                </Link>
                <div className='hidden lg:block'>
                    <SearchInput />
                </div>
                <h2 className='text-emerald-400 text-sm sm:text-lg md:text-2xl font-bold absolute right-24 lg:right-4 top-6'>
                    <span className="text-white text-xs sm:text-base md:text-xl">Welcome, </span>{username}
                </h2>

            </div>
            <div className='absolute right-4 block lg:hidden z-50 top-3'>
                <Hamburger handleClick={handleClick} isMenuActive={isMenuActive} />
            </div>
            {isMenuActive &&
                <div className='h-screen w-full absolute bg-gradient-to-r from-zinc-900 to-zinc-900 via-zinc-800 z-40'>
                    <div className='flex flex-col h-screen items-center justify-center'>
                        <Link to="/home" className="flex items-end space-x-1">
                            <SvgIcon className='w-12 h-14' />
                            <h2 className='text-white text-4xl lg:text-3xl font-bold'>Gamers<span className="text-emerald-400">Lobby</span></h2>
                        </Link>
                        <div className='mt-6'>
                            <SearchInput />
                        </div>
                        <NavigationMenu />
                    </div>
                </div>
            }
        </nav>

    );
}

export default Nav;
