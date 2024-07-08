
import CarouselComponent from "./carousel/Carousel";
import Recommended from "./recommended/Recommended";

const Home = () => {

    return (
        <div className="relative flex min-h-screen flex-col justify-center items-center">
            <div className='relative w-full flex flex-col min-h-screen'>
                <div className="flex flex-col w-full relative">

                    {/* Carousel */}
                    <CarouselComponent />
                    {/* Recommended Games */}
                    <Recommended />
                </div>
            </div>
        </div>
    );
}

export default Home;
