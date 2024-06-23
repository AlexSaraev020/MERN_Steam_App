import { Link } from 'react-router-dom';
import { ReactComponent as HomeSVG } from '../../icons/home.svg';
import { ReactComponent as LogOutSVG } from '../../icons/logout.svg';
import { ReactComponent as FavouritesSVG } from '../../icons/favourite.svg';
import { ReactComponent as StoreSVG } from '../../icons/store.svg';
import { ReactComponent as ProfileSVG } from '../../icons/profile.svg';
import { NavLinkType } from '../../types/types';




const navLinks: NavLinkType[] =[
    {to: '/', icon: <HomeSVG className="h-4 w-4 md:h-4 md:w-4 lg:h-6 lg:w-6 mr-1 sm:mr-2" />, label: 'Home'},
    {to: '/', icon: <StoreSVG className="h-4 w-4 md:h-4 md:w-4 lg:h-6 lg:w-6 mr-1 sm:mr-2" />, label: 'Catalogue'},
    {to: '/', icon: <ProfileSVG className="h-4 w-4 md:h-4 md:w-4 lg:h-6 lg:w-6 mr-1 sm:mr-2" />, label: 'Profile'},
    {to: '/', icon: <FavouritesSVG className="h-4 w-4 md:h-4 md:w-4 lg:h-6 lg:w-6 mr-1 sm:mr-2" />, label: 'Favorite'},
    {to: '/', icon: <LogOutSVG className="h-4 w-4 md:h-4 md:w-4 lg:h-6 lg:w-6 mr-1 sm:mr-2" />, label: 'Log Out'}
]

const NavigationMenu: React.FC = () => {
    return (
        <div className="text-white items-center justify-center flex">
            <ul className="space-x-20 flex md:text-sm lg:text-md xl:text-lg 2xl:text-xl font-bold border-b py-1 sm:py-2">
                {navLinks.map((link , index)=>(
                    <Link to={link.to} key={index}>
                    <li className="flex items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 hover:cursor-pointer">
                        {link.icon}{link.label}
                    </li>
                </Link>
                ))}
                
            </ul>
        </div>


    )

}

export default NavigationMenu