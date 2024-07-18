import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as SearchSVG } from '../../icons/search.svg';
import { ReactComponent as ClearText } from '../../icons/clear.svg'

const SearchInput = ({setIsMenuActive} : {setIsMenuActive : (isMenuActive:boolean) => void}) => {
    const navigate = useNavigate();
    const [enteredText, setEnteredText] = useState<string>('');
    const [isActive, setIsActive] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEnteredText(e.target.value);
    }

    useEffect(() => {
        if (enteredText.length > 0) {
            setIsActive(true);
        } else {
            setIsActive(false)
        }
    }, [enteredText.length, isActive])

    const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setEnteredText('')
        
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement> | MouseEvent) => {
        e.preventDefault();
        try {
            if (enteredText) {
                navigate(`/searchbytitle/${enteredText}`);
                setEnteredText('')
                setIsMenuActive(false)
            } else {
                alert('Enter a game title');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form autoComplete="off" className="relative -top-1 lg:block text-white transition-opacity duration-500 ease-in-out animate-fadeIn" onSubmit={handleSubmit}>
            <div className="relative">
                <input
                    placeholder="Search in catalogue..."
                    className="shadow-lg shadow-emerald-500/30 bg-zinc-700 bg-opacity-30 border-2 border-transparent px-4 py-3 lg:px-3 lg:py-1 xl:px-4 xl:py-2 rounded-xl w-80 transition-all lg:focus:w-96 outline-none focus:border-emerald-400 pr-12"
                    name="search"
                    value={enteredText}
                    onChange={handleChange}
                />
                {isActive &&

                    <button onClick={handleClear} type="button" className="right-11 top-0 h-full absolute transition-opacity duration-500 ease-in-out animate-fadeIn">
                        <ClearText className="fill-emerald-500 w-6 h-6 md:w-5 md:h-5 " />
                    </button>

                }

                <button type="submit" className="absolute right-0 top-0 h-full mr-4">
                    <SearchSVG className="w-6 h-6 text-emerald-400 hover:text-emerald-600" />
                </button>
            </div>
        </form>
    );
}

export default SearchInput;
