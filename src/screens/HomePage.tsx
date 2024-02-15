import { useNavigate } from "react-router-dom";
import { banner, categoryList } from "../typescript/categoryList";

const HomePage = () => {
	return (
		<div className="w-full h-full grid grid-rows-[auto,1fr]" id="homepage">
			<header className="w-full h-12 flex place-items-center place-content-center md:h-[68px]">
				<img src="../../public/icons/campus_header_logo.webp" alt="campus_logo" width={140} height={27} className="align-middle" />
			</header>

			<main className="w-full flex flex-col place-items-start place-content-center">
				{
					categoryList.map((category, index) => (
						<div className="w-full flex flex-col place-items-center place-content-center mb-[5vw] last:mb-0" key={index}>
							<Banner logo={banner[index].logo} content={banner[index].content} background={banner[index].background} />
							<ShoeCardContainer shoeList={category} />
						</div>
					))
				}
			</main>
		</div>
	);
};

const Banner = ({ logo, content, background }: { logo: string, content: string, background: string }) => {
	return (
		<div className="w-full h-[21vw] flex place-items-center relative group overflow-x-hidden">
			<div className="w-full h-full flex place-items-center absolute z-20 group-hover:translate-x-[-14%]" style={{ backgroundImage: "url('../../public/banner/black.webp')", backgroundSize: "100%", backgroundRepeat: "no-repeat", transition: "all 0.35s ease-out" }}>
				<div className="w-[23%] h-[69%] absolute z-20 translate-x-[90%]" style={{ backgroundImage: `url(${logo})`, backgroundSize: "100%", backgroundRepeat: "no-repeat" }}></div>
			</div>

			<div className="w-full h-full absolute z-10 translate-x-[-29%] opacity-0 group-hover:translate-x-[0%] group-hover:opacity-100" style={{ backgroundImage: `url(${content})`, backgroundSize: "100%", backgroundRepeat: "no-repeat", transition: "all 0.35s ease-out" }}></div>

			<div className="w-full h-full absolute group-hover:translate-x-[14%]" style={{ backgroundImage: `url(${background})`, backgroundSize: "100%", backgroundRepeat: "no-repeat", transition: "all 0.35s ease-in-out" }}></div>
		</div>
	);
};

const ShoeCardContainer = ({ shoeList }: { shoeList: Array<shoe> }) => {
	const navigate = useNavigate();

	const navigateToViewIn3D = (key: string) => {
		navigate(`/collections?productCode=${key}`);
	};

	return (
		<section className="w-full grid grid-cols-4 px-[4vw] py-[3vw]">
			{
				shoeList.map((shoe, index) => (
					<div className="h-max flex flex-col my-[1.25vw] mx-[0.25vw]" key={index}>
						<div className="w-full flex place-items-center place-content-center bg-[#f2f2f2] cursor-pointer aspect-square">
							<img src={shoe.image} alt="shoe-image" className="w-[95%] h-[95%] transition duration-[0.5s] hover:scale-110" />
						</div>

						<div className="flex place-items-center place-content-start my-[0.5vw]">
							<span className="text-[#707070] text-[0.75vw]"> In {shoe.colors.length} colors </span>
							<div className="flex place-items-center place-content-between ml-[1vw]">
								{
									shoe.colors.map((color, index) => {
										if (index < 3) {
											return (
												<span className="w-[1vw] h-[1vw] rounded-full mx-[0.5vw]" style={{ backgroundImage: color.gradient, backgroundSize: "100%", backgroundRepeat: "no-repeat" }} key={index}></span>
											);
										}
									})
								}
								{
									(shoe.colors.length > 3)
									&&
									<span className="w-[1vw] h-[1vw] rounded-full mx-[0.5vw]" style={{ backgroundImage: "url('../../public/icons/more_colors.png')", backgroundSize: "100%", backgroundRepeat: "no-repeat" }}></span>
								}
							</div>
						</div>

						<div className="w-full border-t-2 border-[#f2f2f2]">
							<h2 className="text-[1vw] text-[#231f20] text-left my-[0.5vw]"> {shoe.name} </h2>
						</div>

						<div className="w-full">
							<button type="button" className="w-full h-[3vw] flex place-items-center place-content-center text-[1vw] text-white font-[OpenSans-Semibold] border border-[#ee3431] bg-[#ee3431] select-none cursor-pointer hover:text-[#ee3431] hover:bg-white" style={{ transition: "background-color 0.3s ease" }} onClick={() => {
								navigateToViewIn3D(shoe.name.substring(0, shoe.name.indexOf(' ')));
							}}> View in 3D </button>
						</div>
					</div>
				))
			}
		</section>
	);
};

interface shoe {
	name: string,
	price: string,
	colors: {
		name: string,
		gradient: string,
		texture: string
	}[],
	image: string,
	glb: string,
	hotspots: {
		dataSurface: string,
		annotation: string
	}[]
};

export default HomePage;