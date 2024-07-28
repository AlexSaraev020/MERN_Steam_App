import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as SvgIcon } from '../../icons/logo.svg';
import { ReactComponent as Hide } from '../../icons/hide.svg';
import { ReactComponent as Unhide } from '../../icons/unhide.svg';
import background from '../../images/login.webp';
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import Cookies from 'js-cookie';
import Themes from '../themeSelector/Themes';
import { useThemes } from '../../contexts/ThemeContext';
import { loginUser } from '../../actions/apiRequests';
import { FailAlert } from '../errorAlerts/FailAlert';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [password, setPassword] = useState<string | undefined>(undefined);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const { setUserId } = useUser();
    const [showPass, setShowPass] = useState<boolean>(false);
    const [close, setClose] = useState<boolean>(false)
    const [error, setError] = useState<string | undefined>(undefined)
    const [message, setMessage] = useState<string | undefined>(undefined);


    const { theme } = useThemes();

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await loginUser({ email, password, rememberMe, setUserId, navigate , setError,setClose , setMessage })
    };

    return (
        <div className={`h-screen relative`}>
            <div className="absolute left-4 z-10 top-4 flex space-x-2 items-center">
                <Themes />
            </div>
            <img className='h-full w-full absolute object-cover blur-sm ' alt='backgroundLogin' src={background} />
            <div className={`absolute inset-0 bg-zinc-950 opacity-80`}></div>
            <form onSubmit={handleSubmit} className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out animate-fadeIn`}>
                <div className={`w-10/12 sm:w-8/12 md:w-6/12 lg:w-5/12 xl:w-4/12 2xl:w-3/12 shadow-glow shadow-${theme}-500 border-${theme}-400 border-opacity-50 border-[0.2rem] flex flex-col items-center justify-center rounded-xl bg-zinc-900 bg-opacity-80`}>
                    <div className='flex items-center justify-center mx-auto mt-10 mb-2 sm:mb-8 space-x-1'>
                        <SvgIcon className={`h-12 w-12 sm:h-14 sm:w-14 stroke-${theme}-500`} />
                        <h2 className={`text-zinc-200 text-[1.5rem] sm:text-[2.5rem] font-bold`}>
                            Gamers<span className={`text-${theme}-500`}>Lobby</span>
                        </h2>
                    </div>
                    <div className='w-10/12'>
                        <label htmlFor="email" className={`flex text-sm sm:text-lg font-medium text-zinc-200 ml-1`}>
                            Email
                        </label>
                        <input
                            autoComplete="email"
                            type="email"
                            id="email"
                            name="email"
                            className={`mt-1 p-2 w-full text-sm sm:text-md transition-all duration-500 border-zinc-400 border rounded-md mb-5 bg-transparent font-semibold text-zinc-200 focus:border-${theme}-500 placeholder-zinc-200 placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-${theme}-400`}
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='w-10/12 relative'>
                        <label htmlFor="password" className={`flex text-sm sm:text-lg font-medium text-zinc-200 ml-1`}>
                            Password
                        </label>
                        <input
                            autoComplete="current-password"
                            type={showPass ? 'text' : 'password'}
                            id="password"
                            name="password"
                            className={`mt-1 p-2 w-full text-sm sm:text-md transition-all duration-500 border-zinc-400 border rounded-md mb-5 bg-transparent font-semibold text-zinc-200 focus:border-${theme}-500 placeholder-zinc-200 placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-${theme}-400`}
                            placeholder="●●●●●●●●"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type='button' onClick={() => setShowPass(!showPass)} className={`absolute right-0 p-2`}>
                            {showPass ?
                                <Hide className={`w-7 h-7 fill-${theme}-500 transition-opacity duration-500 ease-in-out animate-fadeIn`} /> :
                                <Unhide className={`w-7 h-7 fill-zinc-600 transition-opacity duration-500 ease-in-out animate-fadeIn`} />
                            }
                        </button>
                    </div>
                    <div className='flex w-10/12 items-start mb-5'>
                        <div className="flex items-center">
                            <input
                                onChange={(e) => setRememberMe(e.target.checked)}
                                id="remember"
                                type="checkbox"
                                className="hidden"
                            />
                            <label htmlFor="remember" className={`relative w-5 h-5 border-2 border-${theme}-500 rounded bg-zinc-800 focus:ring-4 focus:ring-${theme}-500 cursor-pointer`}>
                                <span className="absolute inset-0 flex items-center justify-center">
                                    {rememberMe && (
                                        <svg className={`w-5 h-5 fill-${theme}-500`} fill='none' xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" id="verified">
                                            <path d="M186.301 339.893L96 249.461l-32 30.507L186.301 402 448 140.506 416 110z"></path>
                                        </svg>
                                    )}
                                </span>
                            </label>
                            <span className="ml-2 text-sm font-semibold text-zinc-300">Remember me</span>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className={`w-10/12 shadow-md shadow-zinc-600 hover:shadow-${theme}-500 hover:text-${theme}-500 transition-all duration-500 hover:scale-105 bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 text-white text-xl font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-md hover:bg-${theme}-600 mb-6`}
                    >
                        Login
                    </button>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-start w-10/12 mb-10'>
                        <label htmlFor="password" className={`flex text-xs sm:text-md font-sm text-white`}>
                            Don’t have an account yet?
                        </label>
                        <div className='flex mt-4 sm:mt-0 items-center space-x-5 sm:space-x-0 sm:justify-center'>
                            <div className={`sm:mt-0 shadow-md sm:shadow-none shadow-${theme}-500  px-4 py-1 rounded-md bg-gradient-to-tr sm:bg-none from-zinc-900 via-zinc-800 to-zinc-900`}>
                                <Link
                                    to='/register'
                                    className={`text-${theme}-500 text-sm sm:text-md font-bold sm:hover:underline`}
                                >
                                    Sign Up
                                </Link>
                            </div>
                            <div className={`sm:mt-0 flex justify-center sm:w-fit shadow-md sm:shadow-none shadow-zinc-500 px-6 py-1 rounded-md bg-gradient-to-tr sm:bg-none from-zinc-900 via-zinc-800 to-zinc-900`}>
                                <Link
                                    to={`/`}
                                    className={`text-zinc-400 text-sm sm:text-md font-bold sm:hover:underline`}
                                >
                                    Guest
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-10 w-10/12 sm:w-8/12 md:w-6/12 lg:w-4/12 xl:w-3/12'>
                    <FailAlert
                        message={message}
                        error={error}
                        close={close}
                        setClose={setClose}
                    />
                </div>
            </form>
        </div>
    );
}

export default Login;
