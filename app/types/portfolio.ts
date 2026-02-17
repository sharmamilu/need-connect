// types/portfolio.ts
export type Portfolio = {
  profilePhoto?: string;
  name: string;
  profession: string;
  bio: string;

  services: string[];
  skills: string[];
  gallery: string[];

  links: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
};
