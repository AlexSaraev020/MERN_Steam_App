import { Link } from 'react-router-dom';
import { ReactComponent as HomeSVG } from '../../icons/home.svg';
import { ReactComponent as LogOutSVG } from '../../icons/logout.svg';
import { ReactComponent as FavouritesSVG } from '../../icons/favourite.svg';
import { ReactComponent as StoreSVG } from '../../icons/store.svg';
import { ReactComponent as ProfileSVG } from '../../icons/profile.svg';
import { NavLinkType } from '../../types/types';




const navLinks: NavLinkType[] = [
    { to: '/', icon: <HomeSVG className="h-4 w-4 md:h-4 md:w-4 lg:h-6 lg:w-6 mr-1 sm:mr-2" />, label: 'Home' },
    { to: '/', icon: <StoreSVG className="h-4 w-4 md:h-4 md:w-4 lg:h-6 lg:w-6 mr-1 sm:mr-2" />, label: 'Catalogue' },
    { to: '/', icon: <ProfileSVG className="h-4 w-4 md:h-4 md:w-4 lg:h-6 lg:w-6 mr-1 sm:mr-2" />, label: 'Profile' },
    { to: '/', icon: <FavouritesSVG className="h-4 w-4 md:h-4 md:w-4 lg:h-6 lg:w-6 mr-1 sm:mr-2" />, label: 'Favorite' },
    { to: '/', icon: <LogOutSVG className="h-4 w-4 md:h-4 md:w-4 lg:h-6 lg:w-6 mr-1 sm:mr-2" />, label: 'Log Out' }
]

const NavigationMenu: React.FC = () => {
    return (
        <div className="text-white items-center justify-center flex">
            <ul className="space-x-10 flex md:text-sm lg:text-md xl:text-lg 2xl:text-xl font-bold border-b py-1 sm:py-2">
                {navLinks.map((link, index) => (
                    <Link to={link.to} key={index} className='flex items-center justify-center'>
                        <button
                            className="group relative flex items-center justify-center overflow-hidden rounded md:px-4 lg:px-8 xl:px-10 py-3 text-md font-medium hover:text-emerald-300 text-white focus:outline-none focus:ring active:bg-emerald-600 active:text-white">
                            <span className="ease absolute left-0 top-0 h-0 w-0 border-t-2 lg:border-t-4 border-emerald-600 transition-all duration-200 group-hover:w-full"></span>
                            <span className="ease absolute right-0 top-0 h-0 w-0 border-r-2 lg:border-r-4 border-emerald-600 transition-all duration-200 group-hover:h-full"></span>
                            <span className="ease absolute bottom-0 right-0 h-0 w-0 border-b-2 lg:border-b-4 border-emerald-600 transition-all duration-200 group-hover:w-full"></span>
                            <span className="ease absolute bottom-0 left-0 h-0 w-0 border-l-2 lg:border-l-4 border-emerald-600 transition-all duration-200 group-hover:h-full"></span>
                            <span className=' fill-black'>{link.icon}</span>
                            {link.label}
                        </button>
                    </Link>
                ))}

            </ul>
        </div>


    )

}

export default NavigationMenu