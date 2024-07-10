import React from 'react'
import { ReactComponent as Logo } from '../../icons/pixel.svg';
import { ReactComponent as Instagram } from '../../icons/instagram.svg';
import { ReactComponent as Facebook } from '../../icons/facebook.svg';
import { ReactComponent as Github } from '../../icons/github.svg';
import { ReactComponent as LinkedIn } from '../../icons/linkedin.svg';


function Footer() {
    return (
        <footer className="footer text-white flex w-full border-t-2 border-zinc-700 h-[20rem]">
            <div className='mt-10 flex relative w-full'>
                <div className=' h-full w-3/12 flex flex-col justify-start'>
                    <div className=' ml-28 flex items-end relative space-x-2 '>
                        <Logo className='w-14' />
                        <h2 className=' w-6/12 text-white text-lg sm:text-2xl md:text-5xl font-bold'>Gamers<span className="text-emerald-400">Lobby</span></h2>
                    </div>
                    <p className='text-zinc-300/50'>© Developed with React, Node.js, Express, MongoDB, Tailwind. Non-commercial.</p>

                </div>

                <div className='flex items-center'>
                    <a href="https://www.instagram.com/alexsaraev.15/" target='_blank'><Instagram className='w-10 text-white' /></a>
                    <a href="https://www.facebook.com/alexandru.saraev.3" target='_blank'><Facebook className='w-10' /></a>
                    <a href="https://www.linkedin.com/in/saraev-alexandru-5a3baa265/" target='_blank'><LinkedIn className='w-10' /></a>
                    <a href="https://github.com/AlexSaraev020?tab=repositories" target='_blank'><Github className='w-10' /></a>
                </div>
            </div>

        </footer>
    )
}

export default Footer