import Navbar from "@/components/header/navbar";
import AboutSection from "@/components/home/about";
import PopularServices from "@/components/home/services";
import { CircleChevronRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <div className="my-20 flex flex-col items-center justify-center sm:my-36 lg:my-34">
        <div className="bg-accent-foreground text-accent rounded-lg px-3 py-1 text-center">
          <Link href="/" className="font-semibold">
            NGEPRINT.XYZ
          </Link>
        </div>
        <div className="mt-2 items-center text-center">
          <h1 className="text-5xl font-bold sm:text-7xl lg:text-8xl">
            Solusi Cetak Online
          </h1>
          <p className="mt-4 text-sm sm:text-lg">
            Cetak dokumen, foto, dan lainnya dengan mudah.
          </p>
        </div>
        <div className="mt-20">
          <Link
            href="/services"
            className="text-accent text-lg md:pb-3 bg-accent-foreground hover:bg-accent-foreground/90 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-center md:text-2xl font-semibold transition-all duration-300 hover:shadow-lg"
          >
            <h3>Lihat Layanan</h3>
            <span className="md:mt-1">
              <CircleChevronRight />
            </span>
          </Link>
        </div>
      </div>
      <div className="bg-foreground w-full py-10">
        <div className="mx-auto max-w-screen-xl md:px-4 sm:px-6 lg:px-8">
          <PopularServices />
        </div>
      </div>
      <AboutSection />
    </div>
  );
}
