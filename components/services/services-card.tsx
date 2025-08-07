import React from 'react'
import Image from 'next/image';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

const ServicesCard = () => {
  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Card className="w-full">
        <CardHeader className="flex flex-col items-center">
          <Image
            src="https://imgur.com/UJ4ReCC.png"
            width={200}
            height={200}
            alt="Service Image"
          />
          <CardTitle className="text-2xl text-center">Service Title</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col border border-accent-foreground/20 px-3 py-2 rounded-lg">
            <CardTitle className="text-lg font-semibold self-center mb-1">
              Harga
            </CardTitle>
            <div className="flex justify-between items-center border-b">
              <p>B&W - 1 Sisi</p>
              <p className="font-semibold">Rp. 500<span className='text-muted-foreground'>/lbr</span></p>
            </div>
            <div className="flex justify-between items-center border-b">
              <p>B&W - 2 Sisi</p>
              <p className="font-semibold">Rp. 500<span className='text-muted-foreground'>/lbr</span></p>
            </div>
            <div className="flex justify-between items-center border-b">
              <p>Warna - 1 Sisi</p>
              <p className="font-semibold">Rp. 500<span className='text-muted-foreground'>/lbr</span></p>
            </div>
            <div className="flex justify-between items-center">
              <p>Warna - 2 Sisi</p>
              <p className="font-semibold">Rp. 500<span className='text-muted-foreground'>/lbr</span></p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button className="w-full">Order Now</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ServicesCard
