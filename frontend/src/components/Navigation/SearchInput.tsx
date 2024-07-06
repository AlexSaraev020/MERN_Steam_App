import React, { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as SearchSVG } from '../../icons/search.svg';

const SearchInput = () => {
    const navigate = useNavigate();
    const [enteredText, setEnteredText] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEnteredText(e.target.value);
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement> | MouseEvent) => {
        e.preventDefault();
        try {
            if (enteredText) {
                navigate(`/searchbytitle/${enteredText}`);
            } else {
                alert('Enter a game title');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form autoComplete="off" className="relative -top-1 lg:block text-white" onSubmit={handleSubmit}>
            <div className="relative">
                <input
                    placeholder="Search..."
                    className="shadow-lg shadow-emerald-500/30 bg-zinc-700 bg-opacity-30 border-2 border-transparent px-4 py-3 lg:px-3 lg:py-1 xl:px-4 xl:py-2 rounded-xl w-80 transition-all lg:focus:w-96 outline-none focus:border-emerald-400 pr-12"
                    name="search"
                    value={enteredText}
                    onChange={handleChange}
                />
                <button type="submit" className="absolute right-0 top-0 mt-3 mr-4">
                    <SearchSVG className="w-6 h-6 text-emerald-400 hover:text-emerald-600"/>
                </button>
            </div>
        </form>
    );
}

export default SearchInput;
