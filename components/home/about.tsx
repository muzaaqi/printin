import Image from "next/image";
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Link from "next/link";
import { Github } from "lucide-react";

const AboutSection = () => {
  return (
    <div id="about" className="mx-auto my-20 flex max-w-screen-xl flex-col">
      <div className="max-w-screen-xl px-4 py-2 text-center">
        <h2 className="text-accent-foreground text-3xl font-bold">About</h2>
        <div className="mt-10 grid gap-10 p-4 md:grid-cols-2">
          <div className="flex flex-col xl:items-start">
            <div className="flex flex-col items-center">
              <HoverCard>
                <HoverCardTrigger>
                  <div className="bg-muted border-accent-foreground mt-8 h-40 w-40 cursor-pointer rounded-xl border-2">
                    <Image
                      src="/muzaaqi.svg"
                      alt="MUZAAQI"
                      width={400}
                      height={400}
                      className="rounded-lg"
                    />
                  </div>
                  <h1 className="mt-3 cursor-pointer text-2xl font-semibold">
                    MUZAAQI
                  </h1>
                </HoverCardTrigger>
                <HoverCardContent className="backdrop-blur-md bg-background/20">
                  <div className="flex flex-col items-center text-center justify-center">
                    <h2 className="mb-1">Software Developer</h2>
                    <Link href="https://github.com/muzaaqi" target="_blank">
                      <h2 className="inline-flex items-center gap-1">
                        <Github size={20} />
                        <p className="text-muted-foreground text-sm hover:text-accent-foreground transition-colors duration-150">Visit my Github</p>
                      </h2>
                    </Link>
                  </div>
                </HoverCardContent>
              </HoverCard>
              <h2 className="text-muted-foreground text-xl font-semibold">
                Founder
              </h2>
            </div>
          </div>
          <div className="flex flex-col md:items-end">
            <div className="max-w-md">
              <h1 className="text-2xl font-semibold">Introduction</h1>
              <p className="text-muted-foreground mt-5 text-justify">
                NGEPRINT.XYZ adalah layanan cetak online yang memudahkan Anda
                untuk mencetak dokumen, foto, dan berbagai kebutuhan cetak
                lainnya. Kami menyediakan beragam jenis kertas dan pilihan cetak
                yang dapat disesuaikan dengan kebutuhan Anda. Tujuan kami adalah
                menghadirkan pengalaman mencetak yang mudah, cepat, dan dapat
                diakses oleh semua orang.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
