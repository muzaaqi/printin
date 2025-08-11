import React from "react";

const AboutSection = () => {
  return (
    <div id="about" className="mx-auto max-w-screen-xl flex flex-col my-20">
      <div className="max-w-screen-xl px-4 py-2 text-center">
        <h2 className="text-3xl font-bold text-accent-foreground">About</h2>
        <div className="grid md:grid-cols-2 p-4 gap-10 mt-10">
          <div className="flex flex-col items-start">
            <div>
              <div className="w-40 h-40 bg-muted rounded-lg"></div>
              <h1 className="text-2xl font-semibold">Founder</h1>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="max-w-md">
              <h1 className="text-2xl font-semibold">Introduction</h1>
              <p className="text-muted-foreground text-justify mt-5">
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
