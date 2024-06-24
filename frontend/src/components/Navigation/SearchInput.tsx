import React, { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
    const navigate = useNavigate();
    const [enteredText, setEnteredText] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEnteredText(e.target.value);
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (enteredText) {
                navigate(`/searchbytitle/${enteredText}`);
            }else{
                alert('Enter a game title')
            }
            
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form autoComplete="off" className="relative top-1 hidden lg:block" onSubmit={handleSubmit}>
            <div className="relative group">
                <input
                    placeholder="Search..."
                    className="shadow-2xl bg-zinc-700 bg-opacity-30 border-2 border-transparent px-3 py-1 w-60 xl:px-4 xl:py-2 rounded-xl xl:w-80 transition-all focus:w-96 outline-none focus:border-emerald-400"
                    name="search"
                    value={enteredText}
                    onChange={handleChange}
                />
                <svg
                    className="w-4 h-4 xl:w-5 xl:h-5 absolute top-3 right-3 text-emerald-400"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    ></path>
                </svg>
            </div>
        </form>
    );
}

export default SearchInput;
