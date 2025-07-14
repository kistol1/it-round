import { YMaps } from "@pbe/react-yandex-maps";
import MainModal from "./modules/MainModal";
import { LayerProvider } from "./context/layerContext/LayerProvider";
import { Toaster } from "./components/ui/sonner";
import { CustomMap } from "./components/CustomMap";
import { PlacesProvider } from "./context/placesContext/PlacesProvider";
import { CategoriesProvider } from "./context/categoriesContext/CategoriesProvider";

function App() {
  return (
    <>
      <CategoriesProvider>
        <PlacesProvider>
          <YMaps>
            <LayerProvider>
              <MainModal />
              <CustomMap />
            </LayerProvider>
          </YMaps>
        </PlacesProvider>
      </CategoriesProvider>
      <Toaster />
    </>
  );
}

export default App;
