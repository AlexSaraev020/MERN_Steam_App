import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ReactComponent as SvgIcon } from '../../icons/logo.svg';
import { ReactComponent as Hide } from '../../icons/hide.svg';
import { ReactComponent as Unhide } from '../../icons/unhide.svg';
import Themes from '../themeSelector/Themes';
import { useThemes } from '../../contexts/ThemeContext';
import background from '../../images/login.jpg';

function SignUp() {
    const [name, setName] = useState<string | undefined>(undefined);
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [password, setPassword] = useState<string | undefined>(undefined);
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState<boolean>(false);

    const { theme } = useThemes();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://gamerslobby-api.onrender.com/register', { name, email, password });
            if (response.status === 200) {
                navigate('/login');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='h-screen relative'>
            <div className="absolute right-4 z-10 top-4 flex space-x-2 items-center">
                <h2 className={`font-mono text-${theme}-500 text-md`}>
                    Change Theme
                </h2>
                <Themes />
            </div>
            <img className='h-full w-full absolute object-cover blur-sm' alt='backgroundLogin' src={background} />
            <div className="absolute inset-0 bg-zinc-950 opacity-80"></div>
            <form onSubmit={handleSubmit} className='absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out animate-fadeIn'>
                <div className={`w-10/12 sm:w-8/12 md:w-6/12 lg:w-4/12 xl:w-3/12 shadow-glow shadow-${theme}-500 border-${theme}-400 border-opacity-50 border-[3.5px] flex flex-col items-center justify-center rounded-xl bg-zinc-900 bg-opacity-80`}>
                    <div className='flex items-center justify-center mx-auto mt-10 mb-2 sm:mb-8 space-x-1'>
                        <SvgIcon className={`h-12 w-12 sm:h-14 sm:w-14 stroke-${theme}-500`} />
                        <h2 className={`text-white text-[30px] sm:text-[35px] font-bold`}>
                            Create account
                        </h2>
                    </div>
                    <div className='w-10/12'>
                        <label htmlFor="username" className={`flex text-sm sm:text-lg font-medium text-zinc-300 ml-1`}>
                            Username
                        </label>
                        <input
                            required
                            type="text"
                            maxLength={30}
                            id="username"
                            name="name"
                            className={`mt-1 p-2 w-full text-sm sm:text-md transition-all duration-500 border-zinc-400 border rounded-md mb-5 bg-transparent font-semibold text-zinc-200 focus:border-${theme}-500 placeholder-zinc-200 placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-${theme}-400`}
                            placeholder="Enter your username"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className='w-10/12'>
                        <label htmlFor="email" className={`flex text-sm sm:text-lg font-medium text-zinc-300 ml-1`}>
                            Email
                        </label>
                        <input
                            required
                            type="email"
                            id="email"
                            name="email"
                            className={`mt-1 p-2 w-full text-sm sm:text-md transition-all duration-500 border-zinc-400 border rounded-md mb-5 bg-transparent font-semibold text-zinc-200 focus:border-${theme}-500 placeholder-zinc-200 placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-${theme}-400`}
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='w-10/12 relative'>
                        <label htmlFor="password" className={`flex text-sm sm:text-lg font-medium text-zinc-300 ml-1`}>
                            Password
                        </label>
                        <input
                            required
                            type={showPass ? 'text' : 'password'}
                            id="password"
                            name="password"
                            className={`mt-1 p-2 w-full text-sm sm:text-md transition-all duration-500 border-zinc-400 border rounded-md mb-5 bg-transparent font-semibold text-zinc-200 focus:border-${theme}-500 placeholder-zinc-200 placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-${theme}-400`}
                            placeholder="●●●●●●●●"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type='button' onClick={() => setShowPass(!showPass)} className='absolute right-0 p-2'>
                            {showPass ?
                                <Hide className={`w-7 h-7 fill-${theme}-500 transition-opacity duration-500 ease-in-out animate-fadeIn`} /> :
                                <Unhide className={`w-7 h-7 fill-zinc-600 transition-opacity duration-500 ease-in-out animate-fadeIn`} />
                            }
                        </button>
                    </div>
                    <button
                        type="submit"
                        className={`w-10/12 shadow-md shadow-zinc-600 hover:shadow-${theme}-500 hover:text-${theme}-400 transition-all duration-500 hover:scale-105 bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 text-white text-xl font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-md hover:bg-${theme}-600 mb-6`}
                    >
                        Register
                    </button>
                    <div className='flex items-center justify-start w-10/12 mb-10'>
                        <label htmlFor="password" className="flex text-sm sm:text-md font-sm text-white">
                            You already have an account?
                        </label>
                        <div className={`ml-4 sm:ml-0 sm:mt-0 w-[4.5rem] sm:w-fit shadow-md sm:shadow-none shadow-${theme}-500 px-2 py-1 rounded-md bg-gradient-to-tr sm:bg-none from-zinc-900 via-zinc-800 to-zinc-900`}>
                            <Link to='/login' className={`text-${theme}-500 text-sm sm:text-md font-bold ml-2 hover:underline`}>
                                Log In
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default SignUp;
