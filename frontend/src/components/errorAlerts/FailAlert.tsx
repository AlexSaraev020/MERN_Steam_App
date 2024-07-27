interface FailAlertProps {
  message: string | undefined;
  error: string | undefined;
  close: boolean;
  setClose:(close: boolean)=> void;
}

export const FailAlert: React.FC<FailAlertProps> = ({ message, error , close, setClose}) => {

  return (
    <>
      {close &&
        <div className='text-white shadow-glow shadow-red-500 bg-zinc-800 w-full border-t-4 border-red-500 h-full flex items-start justify-between p-3'>
          <div className='flex'>
            <svg fill="#f05252" width="30px" height="30px" viewBox="0 -8 528 528" xmlns="http://www.w3.org/2000/svg" ><title>fail</title><path d="M264 456Q210 456 164 429 118 402 91 356 64 310 64 256 64 202 91 156 118 110 164 83 210 56 264 56 318 56 364 83 410 110 437 156 464 202 464 256 464 310 437 356 410 402 364 429 318 456 264 456ZM264 288L328 352 360 320 296 256 360 192 328 160 264 224 200 160 168 192 232 256 168 320 200 352 264 288Z" /></svg>
            <div className='flex flex-col'>
              <h2 className='font-bold text-xl'>
                {message}
              </h2>
              <h2 className='text-md'>
                {error}
              </h2>
            </div>
          </div>
          <button onClick={()=>setClose(false)} className='hover:scale-125 transition-all duration-500'>
            <svg fill="#ffffff" width="25px" height="25px" viewBox="-28 0 512 512" xmlns="http://www.w3.org/2000/svg" ><title>cancel</title><path d="M64 388L196 256 64 124 96 92 228 224 360 92 392 124 260 256 392 388 360 420 228 288 96 420 64 388Z" /></svg>
          </button>
        </div>
      }

    </>
  )
}
