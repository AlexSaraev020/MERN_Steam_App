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
                <div className='text-white shadow-glow shadow-green-500 bg-zinc-800 w-full border-t-4 border-green-500 h-full flex items-start justify-between p-3'>
                    <div className='flex'>



                        
                        <div className='flex flex-col'>
                            <h2 className='font-bold text-xl'>
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
