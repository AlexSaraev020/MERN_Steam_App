import React from 'react'

export const XboxButtons = ({theme} : {theme:string}) => {
    return (
        <div className={`bg-black block w-20 h-20 min-[400px]:w-24 min-[400px]:h-24 lg:block lg:w-32 lg:h-32 xl:w-36 xl:h-36 relative rounded-full border-2 border-${theme}-500 shadow-glow-sm shadow-${theme}-500`}>
            <div className="bg-red-500 hover:cursor-pointer hover:scale-125 transition-all duration-500 h-6 w-6 lg:h-7 lg:w-7 rounded-full absolute top-1/2 right-1 lg:right-2 transform -translate-y-1/2 flex items-center justify-center text-black font-bold text-xl lg:text-3xl">
                B
            </div>
            <div className="bg-yellow-500 hover:cursor-pointer hover:scale-125 transition-all duration-500 h-6 w-6 lg:h-7 lg:w-7 rounded-full absolute top-1 lg:top-2 left-1/2 transform -translate-x-1/2 flex items-center justify-center text-black font-bold text-xl lg:text-3xl">
                Y
            </div>
            <div className="bg-blue-500 hover:cursor-pointer hover:scale-125 transition-all duration-500 h-6 w-6 lg:h-7 lg:w-7 rounded-full absolute top-1/2 left-1 lg:left-2 transform -translate-y-1/2 flex items-center justify-center text-black font-bold text-xl lg:text-3xl">
                X
            </div>
            <div className="bg-green-500 hover:cursor-pointer hover:scale-125 transition-all duration-500 h-6 w-6 lg:h-7 lg:w-7 rounded-full absolute bottom-1 lg:bottom-2 left-1/2 transform -translate-x-1/2 flex items-center justify-center text-black font-bold text-xl lg:text-3xl">
                A
            </div>
        </div>
    )
}
