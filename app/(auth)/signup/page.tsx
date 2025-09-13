import FullScreenLoader from "../../../components/Loader";
import SignupPage from "./SignUpPage";

export default function YourComponent() {
  const isLoading = true; 

  if (isLoading) return <FullScreenLoader />;

  return <><SignupPage/> </>;
}
