import { create } from "zustand";
import {StateCreator} from "zustand/index";
interface CheckoutState {
    refresh: number;
}
interface Actions{
    setRefresh: () => void;
}
type CheckoutStore = CheckoutState & Actions;

const storeAPI: StateCreator<CheckoutStore> = (set, get)=>({
    refresh: 0,
    setRefresh: () => {
        const refresh = get().refresh + 1;
        set({ refresh});
    },
})
export const useCheckoutStore = create<CheckoutStore>()(
    storeAPI
);