import FullScreenLoader from "../../../components/Loader";
import ResetPasswordPage from "./ResetPassword";

export default function YourComponent() {
  const isLoading = true; 

  if (isLoading) return <FullScreenLoader />;

  return <><ResetPasswordPage/> </>;
}
