import { SendIcon } from "lucide-react";
import { HandCoins } from "lucide-react";
import { useNavigate } from "react-router";

const LandingPage = () => {
  const router = useNavigate();
  return (
    <div className="mx-auto h-screen w-11/12">
      <div className="flex flex-col items-center justify-center h-screen gap-6">
        {/* Details */}
        <div className="flex flex-1 flex-col gap-4 pt-20">
          <h1 className="text-[40px] md:text-[80px] font-extrabold animate-pulse text-center bg-gradient-to-r from-red-400 via-black to-indigo-500 bg-clip-text text-transparent tracking-tight leading-normal">
            Send files instantly, no sign-up needed.
          </h1>
          <h3 className="text-[50px] savante-font font-semibold text-center">
            Upload your file and share files for free
          </h3>
          <p className="text-3xl savante-font text-center">
            📎 Simple. ⚡ Instant.
          </p>
        </div>
        {/* Role Button */}
        <div className="flex flex-1 flex-row rounded-lg p-4 gap-8 mt-10">
          <div className="flex flex-row gap-5 h-40 w-80 rounded-lg border-2 border-transparent  transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 justify-center items-center p-4 bg-cyan-600">
            <p className="text-xl tracking-widest leading-snug savante-font text-white">
              If you are sender then Click here.
            </p>
            <button
              className="cursor-pointer border-2 rounded-full p-2 animate-bounce"
              onClick={() => router("/sender")}
            >
              <SendIcon />
            </button>
          </div>
          <div className="flex flex-row gap-5 h-40 w-80 rounded-md border-2 border-transparent  transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 justify-center items-center p-4 bg-cyan-600">
            <p className="text-xl tracking-wider leading-snug savante-font text-white">
              If you are receiver then Click here.
            </p>
            <button className="cursor-pointer border-2 rounded-full p-2 animate-bounce" onClick={() => router("/reciever")}>
              <HandCoins />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
