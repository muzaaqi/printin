import StockInfo from "@/components/home/stock-info";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <div className="flex flex-col items-center justify-center my-20 sm:my-36 lg:my-34">
        <div className="px-3 py-1 text-center rounded-lg bg-accent-foreground text-accent">
          <Link href="/" className="font-semibold">
            NGEPRINT.XYZ
          </Link>
        </div>
        <div className="items-center text-center mt-2">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold">
            Solusi Cetak Online
          </h1>
          <p className="text-sm sm:text-lg mt-4">
            Cetak dokumen, foto, dan lainnya dengan mudah.
          </p>
        </div>
        <div className="mt-20">
          <Link
            href="/services"
            className="text-accent text-2xl font-semibold px-4 py-2 rounded-lg bg-accent-foreground"
          >
            Let&apos;s Print It!
          </Link>
        </div>
      </div>
      <div className="w-full bg-accent-foreground py-10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">    
        <h2 className="text-3xl text-accent font-bold text-center mb-10 underline">
          Stok Kertas Tersedia
        </h2>
        <StockInfo />
        </div>
      </div>
      <div
        id="about"
        className="flex flex-col items-center justify-center my-20"
      >
        <div className="max-w-screen-xl px-4 py-2 text-center">
          <h2 className="text-3xl font-bold text-accent-foreground">About</h2>
          <p className="mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
            quaerat unde aliquam sed inventore temporibus ipsum voluptate, fugit
            porro laboriosam? Nostrum rem itaque et ut ad ab fugiat quae
            laudantium.
          </p>
        </div>
      </div>
    </div>
  );
}
