
interface HamburgerProps {
    isMenuActive: boolean;
    handleClick: ()=> void;
}

const Hamburger:React.FC<HamburgerProps> = ({handleClick , isMenuActive}) => {
    

    return (
        <button
            onClick={handleClick}
            className='group flex h-12 w-12 sm:h-14 sm:w-14 cursor-pointer items-center justify-center rounded-2xl bg-zinc-900 border-2 border-emerald-500 p-2'
        >
            <div className="space-y-2">
                <span className={`block h-1 w-7 origin-center rounded-full bg-emerald-500 transition-transform ease-in-out ${isMenuActive ? 'translate-y-1.5 rotate-45' : ''}`}></span>
                <span className={`block h-1 w-7 origin-center rounded-full bg-white transition-transform ease-in-out ${isMenuActive ? 'w-10 -translate-y-1.5 -rotate-45' : ''}`}></span>
            </div>
        </button>
    );
};

export default Hamburger;
