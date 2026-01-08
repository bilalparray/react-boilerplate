export class Banner {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  ctaText?: string;

  bannerType: any;
  isVisible: boolean;

  image_base64?: string;

  constructor(
    id: number,
    title: string,
    description: string,
    imageUrl: string,
    link: string,
    bannerType: any,
    isVisible: boolean,
    ctaText?: string,
    image_base64?: string
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
    this.link = link;
    this.bannerType = bannerType;
    this.isVisible = isVisible;
    this.ctaText = ctaText;
    this.image_base64 = image_base64;
  }
}
