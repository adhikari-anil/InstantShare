import { createBrowserRouter } from "react-router";
import App from "./App.tsx";
import UploadForm from "./component/UploadForm.tsx";
import Sender from "./component/SenderPage/Sender.tsx";
import Reciever from "./component/RecieverPage/Reciever.tsx";

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
  {
    path: "/reciever",
    element: <Reciever />,
  },
]);

export default router;
