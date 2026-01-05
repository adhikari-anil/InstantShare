import { ArrowRight, Download, Sparkles, Upload } from "lucide-react";
import { Link } from "react-router";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5 overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center">
        <div className="max-w-5xl mx-auto text-center z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary">Instant. Secure. Modern.</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-foreground mb-6 leading-tight text-balance">
            Send files,{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
              Instantly
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-balance font-light leading-relaxed">
            Share large files with zero friction. No sign-ups, no limits, no compromises. Pure speed.
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 z-10 relative">
            {/* Sender Card */}
            <Link to="/sender" className="group">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/100 p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 h-96 flex flex-col justify-between backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-colors mb-6 border border-primary/20">
                    <Upload className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Send Files</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Upload your files and instantly share with anyone. Generate unique room codes and let receivers join
                    seamlessly.
                  </p>
                </div>

                <div className="relative z-10 flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  Start Sending
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </div>
            </Link>

            {/* Receiver Card */}
            <Link to="/receiver" className="group">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/100 p-8 hover:border-accent/50 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 h-96 flex flex-col justify-between backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 group-hover:from-accent/30 group-hover:to-accent/20 transition-colors mb-6 border border-accent/20">
                    <Download className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Receive Files</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Join a room with just a code and username. Receive files in real-time with zero setup or account
                    creation.
                  </p>
                </div>

                <div className="relative z-10 flex items-center text-accent font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  Start Receiving
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </div>
            </Link>
          </div>
      </div>
    </div>
  );
};

export default LandingPage;
