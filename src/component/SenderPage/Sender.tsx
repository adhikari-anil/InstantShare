import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Room from "../Room/Room";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowRight, CastIcon, Lock, LockOpenIcon } from "lucide-react";

const Sender = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-slate-900/50 gap-5">
      {/* Header Section */}
      <div className="max-w-full w-full mb-16">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight text-pretty">
            Choose Your Sharing Method
          </h1>
          <p className="text-lg text-muted-foreground">
            Select how you'd like to share your files securely and instantly
          </p>
        </div>
      </div>
      {/* Role Button */}
      <div className="max-w-4xl w-full space-y-4">
        <Dialog>
          <DialogTrigger asChild>
            <button className="w-full group">
              <div
                className={`
                            flex items-center gap-4 p-6 rounded-lg
                            border border-border transition-all duration-300 bg-card hover:bg-card/80 hover:border-primary/50 cursor-pointer hover:shadow-lg hover:shadow-primary/10 active:scale-[0.98]"
                          `}
              >
                {/* Icon */}
                <div
                  className={`
                              flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg
                              transition-colors duration-300 bg-primary/10 text-primary group-hover:bg-primary/20"
                            `}
                >
                  <Lock className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Private Sharing
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Send files securely to specific recipients
                  </p>
                </div>

                {/* Badge or Arrow */}
                <div className="flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </button>
          </DialogTrigger>
          <DialogContent className=" rounded-lg border border-border transition-all duration-300 bg-card hover:bg-card/80 hover:border-primary/50 cursor-pointer hover:shadow-lg hover:shadow-primary/10 active:scale-[0.98]">
            <Room roomType={"private"} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="max-w-4xl w-full space-y-4">
        <Dialog>
          <DialogTrigger asChild>
            <Tooltip>
              <TooltipTrigger asChild>
                <button disabled className="w-full group">
                  <div
                    className={`
                            flex items-center gap-4 p-6 rounded-lg
                            border border-border transition-all duration-300 bg-card hover:bg-card/80 hover:border-primary/50 cursor-pointer hover:shadow-lg hover:shadow-primary/10 active:scale-[0.98]"
                          `}
                  >
                    {/* Icon */}
                    <div
                      className={`
                              flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg
                              transition-colors duration-300 bg-primary/10 text-primary group-hover:bg-primary/20"
                            `}
                    >
                      <LockOpenIcon className="w-6 h-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        Public Sharing
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Send files Publically to specific recipients
                      </p>
                    </div>

                    {/* Badge or Arrow */}
                    <div className="flex-shrink-0">
                      <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent className="font-bold text-xl text-rose-100 animate-marquee">
                <p>Comming Soon ! ! !</p>
              </TooltipContent>
            </Tooltip>
          </DialogTrigger>
          <DialogContent>
            <Room roomType={"public"} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="max-w-4xl w-full space-y-4">
        <Dialog>
          <DialogTrigger asChild>
            <Tooltip>
              <TooltipTrigger asChild>
                <button disabled className="w-full group">
                  <div
                    className={`
                            flex items-center gap-4 p-6 rounded-lg
                            border border-border transition-all duration-300 bg-card hover:bg-card/80 hover:border-primary/50 cursor-pointer hover:shadow-lg hover:shadow-primary/10 active:scale-[0.98]"
                          `}
                  >
                    {/* Icon */}
                    <div
                      className={`
                              flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg
                              transition-colors duration-300 bg-primary/10 text-primary group-hover:bg-primary/20"
                            `}
                    >
                      <CastIcon className="w-6 h-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        Limited Broadcast
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Send files to multiple recipients with limits
                      </p>
                    </div>

                    {/* Badge or Arrow */}
                    <div className="flex-shrink-0">
                      <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent className="font-bold text-xl text-rose-100 animate-marquee">
                <p>Comming Soon ! ! !</p>
              </TooltipContent>
            </Tooltip>
          </DialogTrigger>
          <DialogContent>
            <Room roomType={"boardcast"} />
          </DialogContent>
        </Dialog>
      </div>
      {/* Footer Info */}
      <div className="max-w-4xl w-full mt-16 pt-8 border-t border-border">
        <p className="text-sm text-muted-foreground text-center">
          Your files are encrypted and transferred securely. Learn more about
          our
          <span className="text-primary hover:underline cursor-pointer ml-1">
            security practices
          </span>
          .
        </p>
      </div>
    </div>
  );
};

export default Sender;
