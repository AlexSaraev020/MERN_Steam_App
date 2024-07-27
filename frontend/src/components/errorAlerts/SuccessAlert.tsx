import React from 'react'

interface FailAlertProps {
    message: string | undefined;
    close: boolean;
    setClose: (close: boolean) => void;
}

export const SuccessAlert: React.FC<FailAlertProps> = ({ message, setClose, close }) => {
    return (
        <>
            {close &&
                <div className='text-white shadow-glow shadow-green-500 bg-zinc-800 w-full border-t-4 border-green-500 h-full flex items-center justify-between p-3'>
                    <div className='flex space-x-2'>
                        <svg width="30px" height="30px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#0E9F6E" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336L456.192 600.384z" /></svg>
                        <div className='flex flex-col'>
                            <h2 className='font-bold text-sm md:text-lg '>
                                {message}
                            </h2>
                        </div>
                    </div>
                    <button onClick={() => setClose(false)} className='hover:scale-125 transition-all duration-500'>
                        <svg fill="#ffffff" width="25px" height="25px" viewBox="-28 0 512 512" xmlns="http://www.w3.org/2000/svg" ><title>cancel</title><path d="M64 388L196 256 64 124 96 92 228 224 360 92 392 124 260 256 392 388 360 420 228 288 96 420 64 388Z" /></svg>
                    </button>
                </div>
            }
        </>
    )
}
