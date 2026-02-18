export type PortfolioLocalImage = {
  uri: string;
};

export type Portfolio = {
  _id?: string;
  profilePhoto?: string | PortfolioLocalImage;
  name: string;
  profession: string;
  bio: string;
  location: string;

  services: string[];
  skills: string[];
  gallery: (string | PortfolioLocalImage)[];

  links: {
    linkedin?: string;
    github?: string;
    website?: string;
    [key: string]: string | undefined;
  };
};
