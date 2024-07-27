import React from 'react'

export const Arrows = ({ theme }: { theme: string }) => {
    return (
        <div className={`bg-black block w-20 h-20 min-[400px]:w-24 min-[400px]:h-24 lg:w-32 lg:h-32 relative rounded-full text-${theme}-400 border-2 border-${theme}-500 shadow-glow-sm shadow-${theme}-500`}>
            <div className=" hover:cursor-pointer hover:scale-125 transition-all duration-500 h-6 w-6 rounded-full absolute top-1/2 right-1 transform -translate-y-1/2 flex items-center justify-center font-bold text-md sm:text-2xl lg:text-3xl">
                ▶
            </div>
            <div className="hover:cursor-pointer hover:scale-125 transition-all duration-500 h-6 w-6 rounded-full absolute top-1 left-1/2 transform -translate-x-1/2 flex items-center justify-center font-bold text-md sm:text-2xl lg:text-3xl">
                ▲
            </div>
            <div className="hover:cursor-pointer hover:scale-125 transition-all duration-500 h-6 w-6 rounded-full absolute top-1/2 left-1 transform -translate-y-1/2 flex items-center justify-center font-bold text-md sm:text-2xl lg:text-3xl">
                ◀
            </div>
            <div className="hover:cursor-pointer hover:scale-125 transition-all duration-500 h-6 w-6 rounded-full absolute bottom-1 left-1/2 transform -translate-x-1/2 flex items-center justify-center font-bold text-md sm:text-2xl lg:text-3xl">
                ▼
            </div>
        </div>
    )
}
