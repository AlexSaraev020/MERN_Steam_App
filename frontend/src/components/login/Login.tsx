import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ReactComponent as SvgIcon } from '../../icons/pixel.svg';
import background from '../../images/login.jpg';
import { Link } from 'react-router-dom';


interface LoginProps {
    setUsername: (username: string) => void;
}

function Login({ setUsername }: LoginProps) {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [password, setPassword] = useState<string | undefined>(undefined);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post('http://localhost:3001/login', { email, password })
            .then(response => {
                if (response.status === 200) {
                    setUsername(response.data.username);
                    navigate('/home');
                } else {
                    alert('User not found');
                }
            })
            .catch(error => {
                console.error('Error during login:', error);
                alert('User not found');
            });
    };

    return (
        <div className='h-screen relative'>
            <img className='h-full w-full absolute object-cover' alt='backgroundLogin' src={background} />
            <div className="absolute inset-0 bg-slate-950 opacity-70"></div>
            <form onSubmit={handleSubmit} className='absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center'>
                <div className="w-[300px] sm:w-[400px] border-indigo-400 border-opacity-50 border-[3.5px] flex flex-col items-center justify-center rounded-xl bg-slate-900 bg-opacity-50">
                    <div className='flex items-center justify-center mx-auto mt-10 mb-2 sm:mb-8 '>
                        <SvgIcon className='h-8 w-8 sm:h-14 sm:w-14 mb-2 sm:mb-4' />
                        <h2 className='text-indigo-200 text-[30px] sm:text-[45px] font-bold  '>GameHub</h2>
                    </div>
                    <div className='w-10/12'>
                        <label htmlFor="email" className="flex text-sm sm:text-lg font-medium text-indigo-200 ml-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="mt-1 p-2 w-full text-sm sm:text-md border-indigo-300 border rounded-md mb-6 bg-transparent font-semibold text-indigo-200 focus:border-indigo-400 placeholder-indigo-200 placeholder-opacity-50"
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='w-10/12'>
                        <label htmlFor="password" className="flex text-sm sm:text-lg font-medium text-indigo-200 ml-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="mt-1 p-2 w-full text-sm sm:text-md border-indigo-300 border rounded-md mb-6 bg-transparent font-semibold text-indigo-200 focus:border-indigo-400 placeholder-indigo-200 placeholder-opacity-50"
                            placeholder="●●●●●●●●"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-10/12 bg-indigo-500 text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-md hover:bg-indigo-600 mb-6"
                    >
                        Login
                    </button>
                    <div className='flex items-center justify-start w-10/12 mb-10'>
                        <label htmlFor="password" className="flex text-sm sm:text-md font-sm text-white ">
                            Don’t have an account yet?
                        </label>
                        <Link
                            to='/register'
                            className="text-indigo-400 text-sm sm:text-md font-bold ml-2 hover:underline"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Login;
