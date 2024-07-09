import { Link } from 'react-router-dom';
import { ReactComponent as HomeSVG } from '../../icons/home.svg';
import { ReactComponent as LogOutSVG } from '../../icons/logout.svg';
import { ReactComponent as FavouritesSVG } from '../../icons/favorite.svg';
import { ReactComponent as StoreSVG } from '../../icons/store.svg';
import { ReactComponent as ProfileSVG } from '../../icons/profile.svg';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';


interface NavLinkType {
    id: number;
    to: string;
    icon: JSX.Element;
    label: string;
}



const NavigationMenu = ({ setIsMenuActive }: { setIsMenuActive: (isMenuActive: boolean) => void }) => {
    const navigate = useNavigate();
    const { setUser, user } = useUser()

    const navLinks: NavLinkType[] = [
        { id: 1, to: '/', icon: <HomeSVG className="w-8 h-8 -mb-1 lg:h-6 lg:w-6 mr-1 sm:mr-2" />, label: 'Home' },
        { id: 2, to: '/allgames', icon: <StoreSVG className="w-8 h-8 -mb-1 lg:h-6 lg:w-6 mr-1 sm:mr-2" />, label: 'Catalogue' },
        { id: 3, to: '/profile', icon: <ProfileSVG className="w-8 h-8 -mb-1 lg:h-6 lg:w-6 mr-1 sm:mr-2" />, label: 'Profile' },
        { id: 4, to: `/allfavoritegames/${user?.userId}`, icon: <FavouritesSVG className="w-8 h-8 -mb-1 lg:h-6 lg:w-6 mr-1 sm:mr-2" />, label: 'Favorite' },
    ];

    const handleLogout = () => {
        Cookies.remove('token');
        localStorage.clear();
        setUser(undefined);
        setIsMenuActive(false)
        setTimeout(() => {
            navigate('/login');
        }, 50);
    };

    const handleMenu = () => {
        setIsMenuActive(false)
    };

    return (
        <div className='border-b-2 border-emerald-400 lg:border-0'>
            <ul className="space-y-5 lg:space-y-0 mb-4 mt-6 lg:space-x-10 flex flex-col lg:flex-row items-center justify-center text-2xl lg:text-md xl:text-lg 2xl:text-xl font-bold py-1 sm:py-2">
                {navLinks.map((link) => (
                    <li key={link.id} className='flex items-center justify-center'>

                        <Link onClick={handleMenu} to={link.to} className='flex items-center justify-center'>
                            <button className=" flex text-white hover:text-emerald-500 backdrop-blur-lg bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 rounded-md py-2 px-6 shadow-md shadow-zinc-700/60 hover:shadow-glow hover:shadow-green-500/70 hover:-translate-y-1 hover:scale-110 duration-700 w-48">
                                {link.icon}
                                {link.label}
                            </button>
                        </Link>

                    </li>
                ))}
                <Link onClick={handleLogout} to='/' className='flex items-center justify-center'>
                    <button className=" flex text-white hover:text-emerald-500 backdrop-blur-lg bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 rounded-md py-2 px-6 shadow-md shadow-zinc-700/60 hover:shadow-glow hover:shadow-green-500/70 hover:-translate-y-1 hover:scale-110 duration-700 w-48">
                        <LogOutSVG className="w-8 h-8 -mb-1 lg:h-6 lg:w-6 mr-1 sm:mr-2" />
                        Log Out
                    </button>
                </Link>
            </ul>
        </div>
    );
}

export default NavigationMenu;
