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
        <div className="bg-accent-foreground font-semibold text-sm md:text-md text-accent rounded-lg px-3 py-1 text-center">
          <Link href="/">NGEPRINT.XYZ</Link>
        </div>
        <div className=" mt-5 md:mt-2 items-center text-center">
          <h1 className="text-6xl font-bold sm:text-7xl lg:text-8xl">
            Solusi Cetak Online
          </h1>
          <p className="mt-4 text-sm sm:text-lg">
            Cetak dokumen, foto, dan lainnya dengan mudah.
          </p>
        </div>
        <div className="mt-20">
          <Link
            href="/services"
            className="text-accent bg-accent-foreground hover:bg-accent-foreground/90 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-center text-lg font-semibold transition-all duration-300 hover:shadow-lg md:pb-3 md:text-2xl"
          >
            <h3>Lihat Layanan</h3>
            <span className="md:mt-1">
              <CircleChevronRight />
            </span>
          </Link>
        </div>
      </div>
      <div className="bg-foreground w-full py-10">
        <div className="mx-auto max-w-screen-xl sm:px-6 md:px-4 lg:px-8">
          <PopularServices />
        </div>
      </div>
      <AboutSection />
    </div>
  );
}
