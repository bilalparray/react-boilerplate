export interface BannerDTO {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  image_base64?: string | null;
  link: string;
  ctaText?: string | null;
  bannerType: string;
  isVisible: boolean;
}
