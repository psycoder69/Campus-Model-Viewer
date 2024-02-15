import air_capsule_pro from "../categories/air_capsule_pro.ts";
import nitroboost from "../categories/nitroboost.ts";
import nitrofly from "../categories/nitrofly.ts";
import og from "../categories/og.ts";

const categoryList = [ air_capsule_pro, nitroboost, nitrofly, og ];

const banner = [
    {
        logo: "../../public/banner/acp_logo.webp", 
        content: "../../public/banner/acp_content.webp",
        background: "../../public/banner/acp_bg.webp"
    },

    {
        logo: "../../public/banner/nb_logo.webp",
        content: "../../public/banner/nb_content.webp",
        background: "../../public/banner/nb_bg.webp"
    },

    {
        logo: "../../public/banner/nf_logo.webp",
        content: "../../public/banner/nf_content.webp",
        background: "../../public/banner/nf_bg.webp"
    },

    {
        logo: "../../public/banner/og_logo.webp",
        content: "../../public/banner/og_content.webp",
        background: "../../public/banner/og_bg.webp"
    }
];

const shoeList : Array <shoeInfoTemplate> = [];

for (const category of categoryList) {
    for (const shoe of category) {
        shoeList.push(shoe);
    }
}

interface shoeInfoTemplate {
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

export { shoeList, banner, categoryList };