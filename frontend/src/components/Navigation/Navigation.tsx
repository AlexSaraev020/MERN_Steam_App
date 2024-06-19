import { Link } from 'react-router-dom';
import { ReactComponent as HomeSVG } from '../../icons/home.svg';
import { ReactComponent as LogOutSVG } from '../../icons/logout.svg';
import { ReactComponent as FavouritesSVG } from '../../icons/favourite.svg';
import { ReactComponent as StoreSVG } from '../../icons/store.svg';
import { ReactComponent as ProfileSVG } from '../../icons/profile.svg';


const Navigation: React.FC = () => {
    return (
        <header className="text-white items-center justify-center flex">
            <ul className="space-x-20 flex md:text-sm lg:text-md xl:text-lg 2xl:text-xl font-bold border-b py-1 sm:py-2">
                <Link to='/'>
                    <li className="flex items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 hover:cursor-pointer">
                        <HomeSVG className="h-4 w-4 md:h-4 md:w-4 lg:h-6 lg:w-6 mr-1 sm:mr-2" />Home
                    </li>
                </Link>
                <Link to='/'>
                    <li className="flex items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 hover:cursor-pointer">
                        <StoreSVG className="h-4 w-4 md:h-4 md:w-4 lg:h-6 lg:w-6 mr-1 sm:mr-2" />Catalogue
                    </li>
                </Link>
                <Link to='/'>
                    <li className="flex items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 hover:cursor-pointer">
                        <ProfileSVG className="h-4 w-4 md:h-4 md:w-4 lg:h-6 lg:w-6 mr-1 sm:mr-2" />Profile
                    </li>
                </Link>
                <Link to='/'>
                    <li className="flex items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 hover:cursor-pointer">
                        <FavouritesSVG className="h-4 w-4 md:h-4 md:w-4 lg:h-6 lg:w-6 mr-1 sm:mr-2" />Favourite
                    </li>
                </Link>
                <Link to='/'>
                    <li className="flex items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 hover:cursor-pointer">
                        <LogOutSVG className="h-4 w-4 md:h-4 md:w-4 lg:h-6 lg:w-6 mr-1 sm:mr-2" />Log Out
                    </li>
                </Link>
            </ul>
        </header>


    )

}

export default Navigation