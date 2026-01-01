export type BannerType =
  | "Slider"
  | "ShortAdd"
  | "LongAdd"
  | "Sales"
  | "Voucher";

export interface BannerSM {
  id: number; // from WildValleyFoodsServiceModelBase<number>
  title: string;
  description: string;
  imagePath: string;
  link?: string;
  ctaText?: string;
  bannerType: BannerType;
  isVisible: boolean;
  image_base64?: string; // client-only
}
