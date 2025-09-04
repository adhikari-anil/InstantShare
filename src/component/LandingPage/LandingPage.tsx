import { SendIcon } from "lucide-react";
import { HandCoins } from "lucide-react";
import { useNavigate } from "react-router";

const LandingPage = () => {
  const router = useNavigate();
  return (
    <div className="h-screen md:mx-auto md:w-11/12 lg:w-11/12 lg:mx-auto">
      <div className="flex flex-col h-full justify-between items-center p-2 gap-10">
        {/* Details */}
        <div className="flex-1 flex flex-col justify-between gap-8">
          <h1 className="text-[40px] md:text-[60px] 2xl:text-[100px] font-extrabold animate-pulse text-center bg-gradient-to-r from-red-400 via-black to-indigo-500 bg-clip-text text-transparent tracking-tight leading-normal">
            Send files instantly, no sign-up needed.
          </h1>
          <h3 className="text-[30px] md:text-[40px] 2xl:text-[80px] savante-font font-semibold text-center flex flex-col gap-4">
            Upload your file and share files for free
            <p className="text-xl savante-font text-center">
              📎 Simple. ⚡ Instant.
            </p>
          </h3>
        </div>
        {/* Role Button */}
        <div className="flex-1 flex flex-col items-center md:flex-row rounded-lg gap-4 md:gap-8">
          <div className="h-30 flex flex-row gap-5 rounded-lg border-2 md:h-30 md:w-80 xl:h-40 xl:w-96 border-transparent transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 justify-center items-center p-4 bg-cyan-600">
            <p className="text-lg lg:text-xl tracking-widest leading-snug savante-font text-white">
              If you are sender then Click here.
            </p>
            <button
              className="cursor-pointer border-2 rounded-full p-2 animate-bounce"
              onClick={() => router("/sender")}
            >
              <SendIcon />
            </button>
          </div>
          <div className="h-30 flex flex-row gap-5 md:h-30 md:w-80 xl:h-40 xl:w-96 rounded-md border-2 border-transparent  transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 justify-center items-center p-4 bg-cyan-600">
            <p className="text-lg lg:text-xl tracking-wider leading-snug savante-font text-white">
              If you are receiver then Click here.
            </p>
            <button
              className="cursor-pointer border-2 rounded-full p-2 animate-bounce"
              onClick={() => router("/receiver")}
            >
              <HandCoins />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
