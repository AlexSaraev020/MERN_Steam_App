import { ReactComponent as SvgIcon } from '../../icons/logo.svg';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchInput from './SearchInput';
import Hamburger from './Hamburger';
import NavigationMenu from './NavigationMenu';
import { useUser } from '../../contexts/UserContext';
import Cookies from 'js-cookie';
import userPlaceholder from '../../images/userPlaceholder.png'
import Themes from '../themeSelector/Themes';
import { useThemes } from '../../contexts/ThemeContext';



const Nav = ({ setIsMenuActive, isMenuActive }: { setIsMenuActive: (isMenuActive: boolean) => void, isMenuActive: boolean }) => {

    const { user, userId } = useUser()
    const [isGuest, setIsGuest] = useState<string>('')
    const { theme } = useThemes()

    useEffect(() => {
        const token = Cookies.get('token')
        if (!token) {
            setIsGuest('Guest')
        } else {
            if (user) {
                setIsGuest(user?.name)
            }
        }
    }, [user])


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

    const handleClick = () => {
        setIsMenuActive(!isMenuActive);
    };
    return (
        <nav className={`transition-opacity duration-500 ease-in-out animate-fadeIn`}>
            <div className={`flex items-center justify-center w-full p-2 sm:p-10 z-40 ${!isMenuActive ? 'relative' : 'absolute'} h-[70px]`}>
                <Link to="/" className={`flex items-center space-x-1 absolute left-4 top-4`}>
                    <SvgIcon className={`h-8 w-8 sm:h-10 sm:w-10 stroke-${theme}-500`} />
                    <h2 className={`text-white text-lg sm:text-2xl md:text-3xl font-bold`}>
                        Gamers<span className={`text-${theme}-500`}>Lobby</span>
                    </h2>
                </Link>
                <div className={`hidden lg:block`}>
                    <SearchInput setIsMenuActive={setIsMenuActive} />
                </div>
                <div className={`absolute right-6 lg:flex items-center space-x-4 hidden`}>
                    <Themes />
                    <Link to={`/profile/${userId}`} className={`space-x-2 pr-2 border-2  border-${theme}-500 shadow-glow-sm shadow-${theme}-500 rounded-md flex items-center justify-center transition-all duration-500 hover:scale-105`}>
                        <img src={user?.image ? user.image : userPlaceholder} alt='Profile Pic' className='max-w-[2.5rem] rounded-l-md max-h-[2.5rem]' />
                        <h2 className={`text-${theme}-500 font-mono text-2xl font-bold`}>
                            {isGuest}
                        </h2>
                    </Link>
                </div>
            </div>
            <div className={`absolute right-4 block lg:hidden z-50 top-3`}>
                <Hamburger handleClick={handleClick} isMenuActive={isMenuActive} />
            </div>
            {isMenuActive &&
                <div className={`h-screen w-full absolute bg-gradient-to-r from-zinc-900 to-zinc-900 via-zinc-800 z-40`}>
                    <div className={`flex flex-col h-screen items-center justify-center`}>
                        <Link onClick={handleClick} to="/home" className={`flex items-end space-x-1`}>
                            <SvgIcon className={`w-12 h-14`} />
                            <h2 className={`text-white text-4xl lg:text-3xl font-bold`}>
                                Gamers<span className={`text-${theme}-400`}>Lobby</span>
                            </h2>
                        </Link>
                        <div className={`mt-6`}>
                            <SearchInput setIsMenuActive={setIsMenuActive} />
                        </div>
                        <NavigationMenu setIsMenuActive={setIsMenuActive} />
                    </div>
                </div>
            }
        </nav>


    );
}

export default Nav;
