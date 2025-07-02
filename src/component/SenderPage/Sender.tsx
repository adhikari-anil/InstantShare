import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Room from "../Room/Room";

const Sender = () => {
  return (
    <div className="mx-auto h-screen w-11/12">
      <div className="flex flex-col items-center justify-center h-screen">
        {/* Details */}
        <div className="flex flex-1 flex-col gap-4 pt-20">
          <h1 className="text-[40px] md:text-[80px] font-extrabold text-center bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 animate-fade-in bg-clip-text text-transparent tracking-tight leading-normal">
            Choose your preferrance to share files instantly.
          </h1>
        </div>
        {/* Role Button */}
        <div className="flex flex-1 flex-col items-center rounded-lg p-4 gap-8 mt-10 w-full">
          <div className="w-1/3 flex flex-row gap-5 rounded-lg border-2 border-transparent  transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-red-500 justify-center items-center p-4 bg-cyan-600">
            <Dialog>
              <DialogTrigger asChild>
                <button className="cursor-pointer p-2 text-2xl text-white font-medium">
                  Create Private Room
                </button>
              </DialogTrigger>
              <DialogContent>
                <Room roomType={"private"} />
              </DialogContent>
            </Dialog>
          </div>
          <div className="w-1/3 flex flex-row gap-5 rounded-md border-2 border-transparent  transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-red-500 justify-center items-center p-4 bg-cyan-600">
            <Dialog>
              <DialogTrigger asChild>
                <button className="cursor-pointer p-2 text-2xl text-white font-medium">
                  Create Public Room
                </button>
              </DialogTrigger>
              <DialogContent>
                <Room roomType={"public"} />
              </DialogContent>
            </Dialog>
          </div>
          <div className="w-1/3 flex flex-row gap-5 rounded-md border-2 border-transparent  transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-red-500 justify-center items-center p-4 bg-cyan-600">
            <Dialog>
              <DialogTrigger asChild>
                <button className="cursor-pointer p-2 text-2xl text-white font-medium">
                  BoardCast for limited time
                </button>
              </DialogTrigger>
              <DialogContent>
                <Room roomType={"Boardcast"} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sender;
