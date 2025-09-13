import FullScreenLoader from "../../../components/Loader";
import ProductsPage from "./ProductPage";

export default function YourComponent() {
  const isLoading = true; 

  if (isLoading) return <FullScreenLoader />;

  return <><ProductsPage/> </>;
}
