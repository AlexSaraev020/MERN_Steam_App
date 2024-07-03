import { Link } from 'react-router-dom';
import { ReactComponent as HomeSVG } from '../../icons/home.svg';
import { ReactComponent as LogOutSVG } from '../../icons/logout.svg';
import { ReactComponent as FavouritesSVG } from '../../icons/favorite.svg';
import { ReactComponent as StoreSVG } from '../../icons/store.svg';
import { ReactComponent as ProfileSVG } from '../../icons/profile.svg';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types/types';

interface NavLinkType {
    id: number;
    to: string;
    icon: JSX.Element;
    label: string;
}

interface LogOutProps {
    setUser: (user?: User) => void
}

const NavigationMenu: React.FC<LogOutProps> = ({setUser}) => {
    const navigate = useNavigate();

    const navLinks: NavLinkType[] = [
        { id:1 , to: '/home', icon: <HomeSVG className="w-6 h-6 -mb-1 lg:h-6 lg:w-6 mr-1 sm:mr-2" />, label: 'Home' },
        { id:2 , to: '/allgames', icon: <StoreSVG className="w-6 h-6 -mb-1 lg:h-6 lg:w-6 mr-1 sm:mr-2" />, label: 'Catalogue' },
        { id:3 , to: '/profile', icon: <ProfileSVG className="w-6 h-6 -mb-1 lg:h-6 lg:w-6 mr-1 sm:mr-2" />, label: 'Profile' },
        { id:4 , to: '/favorite', icon: <FavouritesSVG className="w-6 h-6 -mb-1 lg:h-6 lg:w-6 mr-1 sm:mr-2" />, label: 'Favorite' },
        { id:5 , to: '/', icon: <LogOutSVG className="w-6 h-6 -mb-1 lg:h-6 lg:w-6 mr-1 sm:mr-2" />, label: 'Log Out' }
    ];

    const handleLogout = () => {
        Cookies.remove('token');
        localStorage.clear();
        setUser(undefined)
        navigate('/');
    };

    return (
        <div className='border-b-2 border-emerald-400 lg:border-0'>
            <ul className="space-y-5 mb-4 mt-6 lg:space-x-10 flex flex-col lg:flex-row items-center justify-center text-2xl lg:text-md xl:text-lg 2xl:text-xl font-bold lg:border-b border-emerald-500 lg:border-white py-1 sm:py-2">
                {navLinks.map((link) => (
                    <li key={link.id} className='flex items-center justify-center'>

                        <Link onClick={handleLogout} to={link.to} className='flex items-center justify-center'>
                            <button className="group relative flex items-center justify-center overflow-hidden rounded-xl bg-zinc-800 shadow-lg shadow-emerald-500/20 w-60 lg:w-auto border-2 lg:border-0 border-emerald-500 lg:px-8 xl:px-10 py-3 text-md font-medium hover:text-emerald-300 text-white focus:outline-none focus:ring active:bg-emerald-600 active:text-white">
                                <span className="ease absolute left-0 top-0 h-0 w-0 border-t-2 lg:border-t-2 border-emerald-600 transition-all duration-200 group-hover:w-full"></span>
                                <span className="ease absolute right-0 top-0 h-0 w-0 border-r-2 lg:border-r-2 border-emerald-600 transition-all duration-200 group-hover:h-full"></span>
                                <span className="ease absolute bottom-0 right-0 h-0 w-0 border-b-2 lg:border-b-2 border-emerald-600 transition-all duration-200 group-hover:w-full"></span>
                                <span className="ease absolute bottom-0 left-0 h-0 w-0 border-l-2 lg:border-l-2 border-emerald-600 transition-all duration-200 group-hover:h-full"></span>
                                <span className=''>{link.icon}</span>
                                {link.label}
                            </button>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NavigationMenu;
