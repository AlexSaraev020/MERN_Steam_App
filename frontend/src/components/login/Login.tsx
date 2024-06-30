import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ReactComponent as SvgIcon } from '../../icons/pixel.svg';
import background from '../../images/login.jpg';
import { Link } from 'react-router-dom';


function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [password, setPassword] = useState<string | undefined>(undefined);
    const [rememberMe, setRememberMe] = useState<boolean>(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/login', { email, password, rememberMe });

            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                if (response.data.name) {
                    navigate('/home');
                } else {
                    alert('Username not set correctly');
                }
            } else {
                alert('User not found');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('User not found');
        }
    };

    return (
        <div className='h-screen relative'>
            <img className='h-full w-full absolute object-cover blur-sm' alt='backgroundLogin' src={background} />
            <div className="absolute inset-0 bg-black opacity-40 "></div>
            <form onSubmit={handleSubmit} className='absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center'>
                <div className="w-[300px] sm:w-[400px] border-emerald-400 border-opacity-50 border-[3.5px] flex flex-col items-center justify-center rounded-xl bg-zinc-900 bg-opacity-80">
                    <div className='flex items-center justify-center mx-auto mt-10 mb-2 sm:mb-8 '>
                        <SvgIcon className='h-8 w-8 sm:h-14 sm:w-14 mb-2 sm:mb-5' />
                        <h2 className='text-zinc-200 text-[30px] sm:text-[45px] font-bold  '>GameHub</h2>
                    </div>
                    <div className='w-10/12'>
                        <label htmlFor="email" className="flex text-sm sm:text-lg font-medium text-zinc-200 ml-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="mt-1 p-2 w-full text-sm sm:text-md border-emerald-400 border rounded-md mb-5 bg-transparent font-semibold text-zinc-200 focus:border-emerald-400 placeholder-zinc-200 placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                        />

                    </div>
                    <div className='w-10/12'>
                        <label htmlFor="password" className="flex text-sm sm:text-lg font-medium text-zinc-200 ml-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="mt-1 p-2 w-full text-sm sm:text-md border-emerald-400 border rounded-md mb-5 bg-transparent font-semibold text-zinc-200 focus:border-emerald-400 placeholder-zinc-200 placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                            placeholder="●●●●●●●●"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className='flex w-10/12 items-start mb-5'>
                        <div className="flex items-center h-5">
                            <input
                                onChange={(e) => setRememberMe(e.target.checked)}
                                id="remember"
                                type="checkbox"
                                className="w-5 h-5 border-2 border-emerald-500 rounded bg-zinc-800 focus:ring-4 focus:ring-emerald-500"
                            />
                        </div>
                        <label htmlFor="remember" className="ml-2 text-sm font-semibold text-zinc-300">Remember me</label>
                    </div>

                    <button
                        type="submit"
                        className="w-10/12 bg-emerald-500 text-zinc-800 text-xl font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-md hover:bg-emerald-600 mb-6"
                    >
                        Login
                    </button>
                    <div className='flex items-center justify-start w-10/12 mb-10'>
                        <label htmlFor="password" className="flex text-sm sm:text-md font-sm text-white ">
                            Don’t have an account yet?
                        </label>
                        <Link
                            to='/register'
                            className="text-emerald-400 text-sm sm:text-md font-bold ml-2 hover:underline"
                        >
                            Sign Up
                        </Link>
                        <Link
                            to={`/home/${email}`}
                            className="text-emerald-400 text-sm sm:text-md font-bold ml-2 hover:underline"
                        >
                            Guest
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Login;
