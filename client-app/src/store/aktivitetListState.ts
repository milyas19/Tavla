import { IAktiviteter } from '../pages/TableView';
import { atom } from "recoil";

export const aktivitetListState = atom({
    key: "aktivitetListState",
    default: [] as IAktiviteter[],
});