import { ReactComponent as Logo } from '../../icons/logo.svg';
import { ReactComponent as Instagram } from '../../icons/instagram.svg';
import { ReactComponent as Facebook } from '../../icons/facebook.svg';
import { ReactComponent as Github } from '../../icons/github.svg';
import { ReactComponent as LinkedIn } from '../../icons/linkedin.svg';
import { Link } from 'react-router-dom';
import { useThemes } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';


interface FooterLinks {
    id: number;
    title: string;
    icon: JSX.Element;
    href: string;
}

interface FooterRoutes {
    id: number;
    title: string;
    to: string;
}

const Footer = () => {

    const { theme } = useThemes()
    const {userId} = useUser()

    const footerLinks: FooterLinks[] = [
        { id: 1, title: 'Instagram', icon: <Instagram className={`w-8 xl:w-10 fill-${theme}-500 transition-all duration-500`} />, href: 'https://www.instagram.com/alexsaraev.15/' },
        { id: 2, title: 'Facebook', icon: <Facebook className={`w-8 xl:w-10 fill-${theme}-500 transition-all duration-500`} />, href: 'https://www.facebook.com/alexandru.saraev.3' },
        { id: 3, title: 'LinkedIn', icon: <LinkedIn className={`w-8 xl:w-10 fill-${theme}-500 transition-all duration-500`} />, href: 'https://www.linkedin.com/in/saraev-alexandru-5a3baa265/' },
        { id: 4, title: 'Github', icon: <Github className={`w-7 xl:w-9 fill-${theme}-500 transition-all duration-500`} />, href: 'https://github.com/AlexSaraev020?tab=repositories' }
    ]
    const footerRoutes: FooterRoutes[] = [
        { id: 1, title: 'Home', to: '/' },
        { id: 2, title: 'All Games', to: '/allgames' },
        { id: 3, title: 'Favorite', to: '/allfavoritegames/:user' },
        { id: 4, title: 'Profile', to: `/profile/${userId}` }
    ]



    return (
        <footer className={`text-white border-t-2 w-full mt-10 border-zinc-700 md:mt-20 transition-opacity duration-500 ease-in-out animate-fadeIn`}>
            <div className={`mx-auto py-10 px-4 md:px-8 lg:px-12 xl:px-20 flex flex-col w-full items-center`}>
                <div className={`flex flex-col md:flex-row w-full`}>

                    <div className={`w-full md:w-1/3 px-4 mb-6 md:mb-0`}>
                        <div className={`flex items-center mb-4 space-x-1`}>
                            <Logo className={`h-12 w-12 lg:h-14 lg:w-14 stroke-${theme}-500`} />
                            <h2 className={`text-3xl md:text-2xl lg:text-4xl font-bold font-mono`}>
                                Gamers<span className={`text-${theme}-400`}>Lobby</span>
                            </h2>
                        </div>
                        <p className={`text-sm text-gray-400`}>
                            <span className={`text-${theme}-500`}>©</span> Developed with React, Node.js, Express, MongoDB, Tailwind. <br />
                            Non-commercial usage.
                        </p>
                    </div>

                    <div className={`w-full md:w-1/3 px-4 mb-6 md:mb-0 flex md:justify-center`}>
                        <div className={`space-y-2`}>
                            <h2 className={`text-xl lg:text-2xl xl:text-3xl font-semibold text-${theme}-400 font-mono`}>Social links:</h2>
                            <div className={`flex space-x-3 lg:space-x-5`}>
                                {footerLinks.map(link => (
                                    <a key={link.id} href={link.href} target="_blank" rel="noreferrer" className={`text-gray-400 hover:text-${theme}-400  hover:scale-110 transition-all duration-300`}>
                                        {link.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={`w-full md:w-1/3 px-4 flex md:justify-center`}>
                        <div className={`space-y-2`}>
                            <h2 className={`text-xl lg:text-2xl xl:text-3xl font-semibold text-${theme}-400 font-mono`}>Navigate to</h2>
                            <div className={`flex flex-col space-y-2`}>
                                {footerRoutes.map(route => (
                                    <Link key={route.id} to={route.to} className={`text-gray-400 hover:text-${theme}-400 transition-all duration-300`}>
                                        {route.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </footer>

    );
}

export default Footer;
