export class Banner {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  ctaText?: string;
  image_base64?: string;

  constructor(
    id: number,
    title: string,
    description: string,
    imageUrl: string,
    link: string,
    ctaText?: string,
    image_base64?: string
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
    this.link = link;
    this.ctaText = ctaText;
    this.image_base64 = image_base64;
  }
}
