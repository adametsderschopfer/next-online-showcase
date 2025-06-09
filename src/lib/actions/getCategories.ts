import {ICategory, IProduct} from "../../../types";
import prisma from "@/lib/prisma";

type IGetCategories = (ICategory & {
  subCategories: ICategory[];
  products: IProduct[];
})[];

export const getCategories = async (): Promise<IGetCategories> => {
  const data = await prisma.category.findMany({
    where: {
      level: 0,
    },
    include: {
      subCategories: {
        where: {
          level: 1
        }
      },
      products: true
    }
  });

  return data as IGetCategories;
}
