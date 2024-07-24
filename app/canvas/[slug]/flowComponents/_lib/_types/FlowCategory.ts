export type Category = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  subCategories?: Category[];
};
