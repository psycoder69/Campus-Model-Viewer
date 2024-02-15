import "@google/model-viewer";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { shoeList } from "../typescript/categoryList";
import Lottie from "lottie-react";
// import HotspotLottieJson from "../assets/public/animations/128011.json";
import LayerLottieJson from "../../public/animations/layer_animation_3.json";

const ViewIn3D = () => {
    const [searchParams] = useSearchParams();
    const [index, setIndex] = useState(-1);

    const [colorTextureNum, setColorTextureNum] = useState(0);
    const [popupState, setPopupState] = useState(3);
    const [layersState, setLayersState] = useState(false);

    const [defaultTexture, setDefaultTexture] = useState({});

    const addComma = (number: string) => {
        for (let i = number.length - 1, skip = 3; i >= 0; i --, skip --) {
            if (skip === 0) {
                number = number.substring(0, i+1) + "," + number.substring(i+1);

                skip = 2;
            }
        }

        return number;
    };

    const liquidFillRef = useRef <HTMLDivElement> (null);
    const loaderOverlayRef = useRef <HTMLDivElement> (null);
    const layersButtonRef = useRef <HTMLButtonElement> (null);
    const circleLoader = document.getElementById("circle-loader");

    let positionX = 0;

    const runCampusModelLoader = (progress: number) => {
        positionX += 1;

        const positionY = (-690 + (progress * 700));

        if (liquidFillRef.current !== null) {
            liquidFillRef.current.style.backgroundPosition = `${positionX}px ${positionY}%`;
            liquidFillRef.current.style.backgroundRepeat = `repeat-x`;

            const animationDuration = `${progress * 2}`;

            liquidFillRef.current.style.transition = `background-position ${animationDuration} linear`;
            liquidFillRef.current.style.backgroundPosition = `${positionX}px ${positionY}%`;
        }
    };

    const removeLoaderOverlay = () => {
        setTimeout(() => {
            if (loaderOverlayRef.current !== null) {
                loaderOverlayRef.current.style.opacity = '0';
            }

            setPopupState(prev => prev-1);
        }, 1000);

        setTimeout(() => {
            setTimeout(() => {
                if (loaderOverlayRef.current !== null) {
                    loaderOverlayRef.current.remove();
                }
            }, 200);
        }, 1200);
    };

    const onModelViewerLoad = () => {
        if (modelViewerRef.current !== null) {
            setDefaultTexture(modelViewerRef.current.model.materials[0].pbrMetallicRoughness.baseColorTexture.texture);

            modelViewerRef.current.addEventListener("click", (event) => {
                handleModelViewerClick(event);
            })
        }
    };

    let annotations = 0;

    const handleModelViewerClick = (event: Event) => {
        if ((event.target as HTMLElement).hasAttribute("data-surface")) {
            const annotationCard = (event.target as HTMLElement).querySelector <HTMLElement> ("span");

            if (annotationCard !== null) {
                const parentButton = annotationCard.parentElement;

                if (annotationCard.style.display === "none") {
                    if (parentButton !== null) parentButton.style.backgroundImage = "url('../../public/icons/cross.png')";

                    annotationCard.style.display = "block";
                    annotations ++;
                } else {
                    if (parentButton !== null) parentButton.style.backgroundImage = "url('../../public/icons/plus.png')";

                    annotationCard.style.display = "none";
                    annotations --;
                }
            }

            if (modelViewerRef.current !== null) {
                if (annotations === 0) modelViewerRef.current.autoRotate = true; else modelViewerRef.current.autoRotate = false;
            }
        } else {
            hideAnnotations();
        }
    };

    const hideAnnotations = () => {
        if (annotations > 0) {
            annotations = 0;

            for (const button of document.querySelectorAll <HTMLElement> (".hotspot-button")) {
                button.style.backgroundImage = "url('../../public/icons/plus.png')";
            }

            for (const card of document.querySelectorAll <HTMLElement> (".annotation-card")) card.style.display = "none";

            if (modelViewerRef.current !== null) modelViewerRef.current.autoRotate = true;
        }
    };

    const modelViewerRef = useRef <ModelViewerElement> (null);

    useEffect(() => {
        const shoeName = searchParams.get("productCode");

        for (let i = 0; i < shoeList.length; i ++) {
            if (shoeList[i].name.substring(0, shoeList[i].name.indexOf(' ')) === shoeName) {
                setIndex(i);
                break;
            }
        }

        if (index > -1) {
            const modelViewerElement = modelViewerRef.current;

            if (modelViewerElement !== null) {
                modelViewerElement.onprogress = (event: unknown) => { runCampusModelLoader((event as CustomEvent).detail.totalProgress); };

                modelViewerElement.onload = () => { removeLoaderOverlay(); onModelViewerLoad(); };
            }
        }
    }, [index]);

    useEffect(() => {
        if (popupState > 0) return;

        shoeList[index].colors.map((color) => {
            const image = new Image();
            image.src = color.texture;
        });
    }, [popupState]);

    const applyTextureOnModel = async (texture: string, currIndex: number) => {
        try {
            if (circleLoader !== null) circleLoader.style.display = "block";

            if ((modelViewerRef.current !== null) && (currIndex !== colorTextureNum)) {
                setColorTextureNum(currIndex);

                let finalTexture = defaultTexture;

                if (texture.length > 0) finalTexture = await modelViewerRef.current.createTexture(texture);

                if (modelViewerRef.current.model !== null) {
                    modelViewerRef.current.model.materials.forEach((material: { pbrMetallicRoughness: { baseColorTexture: { setTexture: (arg0: object) => object; }; }; baseColorTexture: { setTexture: (arg0: object) => object; }; }) => {
                        if ("baseColorTexture" in material.pbrMetallicRoughness) {
                            material.pbrMetallicRoughness.baseColorTexture.setTexture(finalTexture);
                        } else {
                            material.baseColorTexture.setTexture(finalTexture);
                        }
                    });
                }
            }

            if (circleLoader !== null) circleLoader.style.display = "none";
        } catch (error: any) {
            console.error(`${error.name}: ${error.message}`);
        }
    };

    let lastOrbit: number;

    const rotateCheck = () => {
        if (modelViewerRef.current !== null) {
            const orbit = modelViewerRef.current.getCameraOrbit();

            if (orbit.theta == lastOrbit) {
                modelViewerRef.current.play({ repetitions: 1 });

                setTimeout(() => {
                    modelViewerRef.current?.pause();

                    if (layersButtonRef.current !== null) layersButtonRef.current.disabled = false;
                }, 1800);
            }
            else {
                lastOrbit = orbit.theta;
                requestAnimationFrame(rotateCheck);
            }
        }
	};

    useEffect(() => {
        if (layersButtonRef.current !== null) layersButtonRef.current.disabled = true;

        const hotspotButtons = document.querySelectorAll <HTMLElement> (".hotspot-button");

        if (layersState === true) {
            hideAnnotations();

            for (const button of hotspotButtons) button.style.display = "none";

            if (modelViewerRef.current !== null) {
                modelViewerRef.current.autoRotate = false;
                modelViewerRef.current.cameraOrbit = `${(3.14) / 2 + modelViewerRef.current.turntableRotation}rad 0 50m`;

                requestAnimationFrame(rotateCheck);
            }
        } else {
            if (modelViewerRef.current !== null) {
                modelViewerRef.current.play({ repetitions: 1 });

                setTimeout(() => {
                    if (modelViewerRef.current !== null) {
                        modelViewerRef.current.autoRotate = true;
                    }

                    for (const button of hotspotButtons) button.style.display = "flex";

                    if (layersButtonRef.current !== null) layersButtonRef.current.disabled = false;
                }, 2200);
            }
        }
    }, [layersState]);

    return (
        (index >= 0)
        ?
        <main className="w-full h-full bg-white grid grid-cols-[70%,30%] relative">
            <div className="w-full h-full flex place-items-center place-content-center absolute top-0 left-0 z-[99] bg-[#fcfcfc80]" style={{backdropFilter: "blur(5px)", transition: "opacity 0.5s ease"}} ref={loaderOverlayRef}>
                <div className="opacity-100" style={{transition: "opacity 1s ease"}}>
                    <div className="relative">
                        <img src="../../public/icons/Campus_Logo_Outline.png" alt="campus_logo_outline" />
                        <div className="w-full h-full absolute top-0 left-0 bg-[url('../../public/icons/Campus_Liquid_Fill.png')] bg-repeat-x" style={{backgroundPosition: "0 -700%", maskImage: "url('../../public/icons/Campus_Logo_fill_mask_img.png')", maskRepeat: "no-repeat"}} ref={liquidFillRef}></div>
                    </div>
                </div>
            </div>

            {
                (popupState === 2)
                &&
                <div className="w-full h-full flex place-items-center place-content-center absolute top-0 left-0 z-50 bg-[#000000bf]" style={{backdropFilter: "blur(5px)", transition: "all 1s ease"}}>
                    <div className="w-[30%] rounded-[10px] bg-white p-9" style={{boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)"}}>
                        <span className="flex place-items-start place-content-between">
                            <h2 className="text-[#231f20] text-[1.25vw] font-[OpenSans-Semibold]"> 360 View </h2>
                            <h2 className="text-[#231f20] text-[1.25vw] font-[OpenSans-Semibold]"> 1/2 </h2>
                        </span>
                        <p className="w-[70%] text-[1vw] leading-5 text-[#707070] font-[OpenSans-Regular] my-[2.5vh]">
                            Get the complete picture with the new interactive 3D model.
                            Adjust, spin, and zoom for a new view
                        </p>
                        <div className="flex place-items-center place-content-end">
                            <button type="button" className="w-1/4 text-[1vw] text-white rounded-3xl border-none outline-none bg-[#231f20] font-[OpenSans-Semibold] p-[0.6vw] hover:scale-[1.05] hover:origin-center" style={{boxShadow: "0 0 8px rgba(0, 0, 0, 0.25)", transition: "transform 0.2s ease, transform-origin 0.2s ease"}} onClick={() => setPopupState(prev => prev-1) }>
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            }

            <nav className={`w-full flex place-items-center place-content-between absolute top-[0.5vh] left-0 right-0 p-[2.5vw] ${(popupState > 0) ? "pointer-events-none" : ""}`}>
                <button type="button" className="flex place-items-center place-content-center">
                    <img src="../../public/icons/360_degree_rotate_icon_light.png" alt="360-degree-view" className="w-4/5 hover:cursor-pointer" />
                </button>

                <button type="button" className="flex place-items-center place-content-center">
                    <img src="../../public/icons/go_back_dark.png" alt="go-back" onMouseOver={(event) => { event.currentTarget.src = "../../public/icons/go_back_light.png"; }} onMouseOut={(event) => { event.currentTarget.src = "../../public/icons/go_back_dark.png"; }} className="w-4/5 hover:cursor-pointer" onClick={() => { history.back(); }} />
                </button>
            </nav>

            <section className="w-full h-full flex place-items-center place-content-center bg-[#f2f2f2] relative">
                {
                    (popupState === 1)
                    &&
                    <div className="w-full h-full flex place-items-center place-content-center absolute top-0 left-0 z-40 bg-[#000000bf]" style={{backdropFilter: "blur(5px)"}}>
                        <div className="w-[30vw] rounded-[10px] bg-white p-9" style={{boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)"}}>
                            <span className="flex place-items-start place-content-between">
                                <h2 className="text-[#231f20] text-[1.25vw] font-[OpenSans-Semibold]"> Info Tray </h2>
                                <h2 className="text-[#231f20] text-[1.25vw] font-[OpenSans-Semibold]"> 2/2 </h2>
                            </span>
                            <p className="w-[70%] text-[1vw] leading-5 text-[#707070] font-[OpenSans-Regular] my-[2.5vh]">
                                Explore variations of this shoe. Tap on the layer icon to see the detailed view of layers used in this shoe.
                            </p>
                            <div className="flex place-items-center place-content-end">
                                <button type="button" className="w-1/4 text-[1vw] text-white rounded-3xl border-none outline-none bg-[#231f20] font-[OpenSans-Semibold] p-[0.6vw] hover:scale-[1.05] hover:origin-center" style={{boxShadow: "0 0 8px rgba(0, 0, 0, 0.25)", transition: "transform 0.2s ease, transform-origin 0.2s ease"}} onClick={() => setPopupState(prev => prev-1)}>
                                    Got it
                                </button>
                            </div>
                        </div>
                    </div>
                }

                <img className="w-[5vw] hidden absolute z-20" src="../../public/icons/circle_loader.png" alt="circle_loader" id="circle-loader" />

                <model-viewer src={shoeList[index].glb} orientation="0 20deg 0" camera-orbit="0deg 0 60m" min-camera-orbit="auto auto 40m" max-camera-orbit="auto auto 80m" interpolation-decay="200" rotation-per-second="-8deg" auto-rotate={true} auto-rotate-delay="100" ar-modes="webxr scene-viewer quick-look" camera-controls={true} shadow-intensity="1" disable-pan={true} disable-tap={true} ar-status="not-presenting" ref={modelViewerRef}>
                    {
                        shoeList[index].hotspots.map((hotspot, index) => (
                            <button type="button" data-surface={hotspot.dataSurface} data-visibility-attribute="visible" key={index} slot={`hotspot-${index}`} className="w-[2vw] h-[2vw] flex place-items-center place-content-center border-[0.25vw] border-[#b8b8b8] rounded-full hover:cursor-default hotspot-button" style={{background: "#0000008c url('../../public/icons/plus.png') 0% 0% no-repeat padding-box", backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "45% 45%", transition: "display 0.4s ease"}}>
                                {/* <Lottie animationData={HotspotLottieJson} loop={true} autoplay={true} className="hidden bg-transparent hotspot-button-lottie"></Lottie> */}
                                <span className="w-max absolute bottom-[150%] text-[1.15vw] text-white font-[OpenSans-Regular] bg-[#707070] rounded-[10px] p-[1.15vw] z-[999] annotation-card" style={{display: "none"}} dangerouslySetInnerHTML={{ __html: hotspot.annotation }}></span>
                            </button>
                        ))
                    }
                </model-viewer>
            </section>

            <section className={`bg-white px-[2.5vw] py-[1.5vw] pl-[3.25vw] ${(popupState > 0) ? "pointer-events-none" : ""}`}>
                <div className="w-full mt-[15vh]">
                    <h1 className="w-[85%] text-[1.5vw] font-[OpenSans-Semibold]"> { shoeList[index].name } </h1>
                    <h3 className="w-full text-[#004588] text-[1.125vw] font-[OpenSans-Semibold] font-semibold mt-1">
                        MRP: ₹{ addComma(shoeList[index].price) }
                    </h3>
                </div>

                <div className="mt-[9vh]">
                    <h2 className="text-[1.25vw] font-[OpenSans-Semibold]"> Colors </h2>

                    <div className="grid grid-cols-3 gap-[1.5vw] mt-[1.5vw] relative right-[7%]">
                        {
                            shoeList[index].colors.map((color, index) => (
                                <div className="flex place-items-baseline place-content-center" key={index}>
                                    <button type="button" className="flex flex-col place-items-center place-content-center hover:cursor-pointer" onClick={() => applyTextureOnModel(color.texture, index) }>
                                        <div className="w-[3vw] h-[3vw] border-[3px] border-[#f8f8f8] rounded-full mb-[0.75vh]" style={{background: color.gradient, transition: "all 0.3s ease", transform: `${(colorTextureNum === index) ? "scale(1.15)" : ""}`, boxShadow: `${(colorTextureNum === index) ? "0 2px 6px rgb(0,0,0,0.25)" : ""}`}}></div>
                                        <span className="text-[#231f20] text-[0.8vw] font-[OpenSans-Regular]" dangerouslySetInnerHTML={{__html: color.name}}></span>
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className="mt-[9vh]">
                    <h2 className="text-[1.25vw] font-[OpenSans-Semibold]"> Layers </h2>

                    <button type="button" className="w-[4.75vw] flex place-items-center place-content-center hover:cursor-pointer" onClick={() => setLayersState(prev => !prev) } ref={layersButtonRef}>
                        <Lottie animationData={LayerLottieJson} autoplay={layersState} loop={layersState} />
                    </button>
                </div>
            </section>
        </main>
        :
        <></>
    );
};

interface ModelViewerElement extends HTMLElement {
    pause(): unknown;
    play(arg0: { repetitions: number; }): unknown;
    turntableRotation: number;
    cameraOrbit: string;
    getCameraOrbit(): { theta: number };
    autoRotate: boolean;
    createTexture(createTexture: any): Promise <object>;
    model: any;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

export default ViewIn3D;