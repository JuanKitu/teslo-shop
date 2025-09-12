import {StateCreator, create} from "zustand";

interface UiState {
    isSideMenuOpen: boolean;
}
interface Actions {
    openSideMenu: () => void;
    closeSideMenu: () => void;
}
type UiStore = UiState & Actions;

const storeAPI:StateCreator<UiStore> = (set) => ({
    isSideMenuOpen: false,
    openSideMenu: () => set({isSideMenuOpen: true}),
    closeSideMenu: () => set({isSideMenuOpen: false}),
});
export const useUiStore = create<UiStore>()(
    storeAPI,
)