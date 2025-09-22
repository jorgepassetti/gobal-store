export type Product = {
  id: string;
  title: string;
  price: number;
  discountedPrice: number;
  price_before_discount?: number;
  descriptionHTML?: string;
  media?: { type: 'image' | 'video'; url: string }[];
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
};
