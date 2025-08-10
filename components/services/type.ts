export type Service = {
  id: string;
  serviceName: string;
  serviceSlug: string;
  imageUrl: string;
  remainingStock: number;
  prices: {
    priceSingleSide: number;
    priceDoubleSides: number;
    priceColorSingleSide: number;
    priceColorDoubleSides: number;
  };
};
