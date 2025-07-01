import { createBrowserRouter } from "react-router";
import App from "./App.tsx";
//import LandingPage from "./component/LandingPage/LandingPage.tsx";
import UploadForm from "./component/UploadForm.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Replace with your LandingPage component
  },
  {
    path: "/upload",
    element: <UploadForm />, 
  },
]);

export default router;
