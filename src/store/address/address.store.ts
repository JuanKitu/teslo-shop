import { create } from "zustand";
import { persist } from "zustand/middleware";
import {StateCreator} from "zustand/index";

interface AddressState {
    address: {
        firstName: string;
        lastName: string;
        address: string;
        address2?: string;
        postalCode: string;
        city: string;
        country: string;
        phone: string;
    };
}
interface Actions {
    setAddress: (address: AddressState["address"]) => void;
}
type AddressStore = AddressState & Actions;
const storeAPI: StateCreator<AddressStore> = (set)=>({
    address: {
        firstName: "",
        lastName: "",
        address: "",
        address2: "",
        postalCode: "",
        city: "",
        country: "",
        phone: "",
    },

    setAddress: (address) => {
        set({ address });
    },
})
export const useAddressStore = create<AddressStore>()(
    persist(
        storeAPI,
        {
            name: "address-storage",
        }
    )
);