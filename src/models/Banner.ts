export class Banner {
  id: number;
  title: string;
  description: string;
  imagePath: string; // backend filesystem path
  image_base64: string; // UI renderable base64
  link: string;
  ctaText: string;
  isVisible: boolean;

  constructor(
    id: number,
    title: string,
    description: string,
    imagePath: string,
    image_base64: string,
    link: string,
    ctaText: string,
    isVisible: boolean
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.imagePath = imagePath;
    this.image_base64 = image_base64;
    this.link = link;
    this.ctaText = ctaText;
    this.isVisible = isVisible;
  }
}
