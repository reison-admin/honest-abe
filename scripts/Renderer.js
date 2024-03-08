import {Politicians} from "./Politicians.js";
export const Render = async () => {
    const politicianHTML = await Politicians();
    return `${politicianHTML}`
}