import { createBrowserRouter } from "react-router";
import App from "./App.tsx";
//import LandingPage from "./component/LandingPage/LandingPage.tsx";
import UploadForm from "./component/UploadForm.tsx";
import Sender from "./component/SenderPage/Sender.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Replace with your LandingPage component
  },
  {
    path: "/upload",
    element: <UploadForm />,
  },
  {
    path: "/sender",
    element: <Sender />,
  },
]);

export default router;
