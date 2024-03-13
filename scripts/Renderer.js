import { Corporations } from "./Corporations.js";
import { Donations } from "./Donations.js";
import { PACs } from "./PACs.js";
import {Politicians} from "./Politicians.js";
export const Render = async () => {
    const politicianHTML = await Politicians();
    const corporationsHTML = await Corporations();
    const donationsHTML = await Donations();
    const pacsHTML = await PACs();
    return `${politicianHTML}${corporationsHTML}${pacsHTML}${donationsHTML}`
}