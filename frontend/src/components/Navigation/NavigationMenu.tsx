import { Link } from 'react-router-dom';
import { ReactComponent as HomeSVG } from '../../icons/home.svg';
import { ReactComponent as LogOutSVG } from '../../icons/logout.svg';
import { ReactComponent as FavouritesSVG } from '../../icons/favorite.svg';
import { ReactComponent as StoreSVG } from '../../icons/store.svg';
import { ReactComponent as ProfileSVG } from '../../icons/profile.svg';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { useThemes } from '../../contexts/ThemeContext';
import { useEffect, useState } from 'react';



interface NavLinkType {
    id: number;
    to: string;
    icon: JSX.Element;
    label: string;
}

const NavigationMenu = ({ setIsMenuActive }: { setIsMenuActive: (isMenuActive: boolean) => void }) => {
    const navigate = useNavigate();
    const { setUser, userId } = useUser();
    const { theme } = useThemes()
    const { user, setUserId } = useUser()
    const [isGuest, setIsGuest] = useState<string>('')


    const navLinks: NavLinkType[] = [
        { id: 1, to: '/', icon: <HomeSVG className="w-6 mr-1" />, label: 'Home' },
        { id: 2, to: '/allgames', icon: <StoreSVG className="w-6 mr-1" />, label: 'Catalogue' },
        { id: 3, to: `/profile/${userId}`, icon: <ProfileSVG className="w-5 mr-1" />, label: 'Profile' },
        { id: 4, to: `/allfavoritegames/${userId}`, icon: <FavouritesSVG className="w-6 mr-1" />, label: 'Favorite' },
    ];

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


    const handleLogout = () => {
        Cookies.remove('token');
        setUser(undefined);
        setIsMenuActive(false);
        setUserId(undefined);
        setTimeout(() => {
            navigate('/login');
        }, 100);
    };

    const handleMenu = () => {
        setIsMenuActive(false);
    };

    return (
        <div className={`border-b-2 border-${theme}-400 lg:border-0 transition-opacity duration-500 ease-in-out animate-fadeIn`}>

            <ul className={`space-y-5 lg:space-y-0 mb-4 mt-6 lg:space-x-10 flex flex-col lg:flex-row items-center justify-center text-lg lg:text-md xl:text-lg 2xl:text-xl font-bold py-1 sm:py-2 text-${theme}-200`}>
                {navLinks.map((link) => (
                    <li key={link.id} className='flex items-center justify-center font-mono'>
                        <Link
                            onClick={handleMenu}
                            to={link.to}
                            className={`flex items-center text-zinc-200 hover:text-${theme}-500 backdrop-blur-lg bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 rounded-md py-2 px-6 shadow-md shadow-zinc-600/60 hover:shadow-glow hover:shadow-${theme}-500 hover:-translate-y-1 hover:scale-110 duration-700 w-48 lg:w-40 xl:w-48`}
                        >
                            {link.icon}
                            <h2 className='h-6'>
                                {link.label}
                            </h2>
                        </Link>
                    </li>
                ))}
                <Link onClick={handleLogout} to='/' className={`flex items-center text-zinc-200 hover:text-${theme}-500 backdrop-blur-lg bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 rounded-md py-2 px-6 shadow-md shadow-zinc-600/60 hover:shadow-glow hover:shadow-${theme}-500 hover:-translate-y-1 hover:scale-110 duration-700 w-48 lg:w-40 xl:w-48`}
                >
                        <LogOutSVG className={`w-6 mr-1`} />
                        {user ? 'Log Out' : 'Exit'}
                </Link>
                <Link onClick={handleMenu} to={`/profile/${userId}`} className={`space-x-2 lg:hidden px-2 border-2  border-${theme}-500 shadow-glow-sm shadow-${theme}-500 rounded-md flex items-center justify-center transition-all duration-500 hover:scale-105`}>
                    <h2 className={`text-${theme}-500 max-w-40 truncate font-mono text-2xl font-bold`}>
                        {isGuest}
                    </h2>
                </Link>
            </ul>
        </div>

    );
}

export default NavigationMenu;
