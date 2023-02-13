import { IAktiviteter } from './../components/View/TableView';
import { atom } from "recoil";

export const aktivitetListState = atom({
    key: "aktivitetListState",
    default: [] as IAktiviteter[],
});