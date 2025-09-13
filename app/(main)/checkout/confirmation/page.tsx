import FullScreenLoader from "../../../../components/Loader";
import CheckoutConfirmationPage from "./CheckOutPage";

export default function YourComponent() {
  const isLoading = true; 

  if (isLoading) return <FullScreenLoader />;

  return <><CheckoutConfirmationPage/> </>;
}
