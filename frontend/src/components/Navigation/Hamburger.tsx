import { useThemes } from "../../contexts/ThemeContext";

interface HamburgerProps {
    isMenuActive: boolean;
    handleClick: ()=> void;
}

const Hamburger:React.FC<HamburgerProps> = ({handleClick , isMenuActive}) => {

    const {theme} = useThemes()
    

    return (
        <button
    onClick={handleClick}
    className={`group flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl bg-${theme}-900 border-2 border-${theme}-500 p-2`}
>
    <div className="space-y-2">
        <span className={`block h-1 w-7 origin-center rounded-full bg-${theme}-500 transition-transform ease-in-out ${isMenuActive ? 'translate-y-1.5 rotate-45' : ''}`}></span>
        <span className={`block h-1 w-7 origin-center rounded-full bg-white transition-transform ease-in-out ${isMenuActive ? '-translate-y-1.5 -rotate-45' : ''}`}></span>
    </div>
</button>

    );
};

export default Hamburger;
