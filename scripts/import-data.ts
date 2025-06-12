import fetch from 'node-fetch';
import {parseStringPromise} from 'xml2js';

import {
  EDataSourceName,
  ICategory,
  IGiftsCategoriesNM,
  IGiftsRawCategory,
  IGiftsRawProduct,
  IHappyGiftsCatalog,
  IHappyGiftsCategory,
  IHappyGiftsItem,
  IHappyGiftsSubChildGroup,
  IHappyGiftsSubGroup,
  IOasisCategories,
  IOasisCategory,
  IOasisProduct,
  IOasisProducts,
  IProduct,
} from "../types";
import {PrismaClient} from "@/prisma/generated";

const PRICE_INCREASE_PERCENT = 20;
const upPrice = (price: number) => parseFloat((price * (1 + PRICE_INCREASE_PERCENT / 100)).toFixed(2));
const toSourcedId = (id: string, sourceName: EDataSourceName) => `${id}-${sourceName.toLowerCase()}`

const prisma = new PrismaClient();

// --------------------
// 1. Чтение данных
// --------------------
const fetchGiftsXML = async (endpoint: string): Promise<string> => {
  const url = `https://api2.gifts.ru/export/v2/catalogue/${endpoint}`;
  const res = await fetch(url, {headers: {Authorization: 'Basic ' + Buffer.from(`${process.env.GIFTS_RU_LOGIN}:${process.env.GIFTS_RU_PASSWORD}`).toString('base64')}});
  return res.text();
}

const fetchOasisXML = async (path: string): Promise<string> => {
  const url = `https://api.oasiscatalog.com/v4/${path}?key=${process.env.OASIS_API_KEY}`;
  const res = await fetch(url);
  return res.text();
}

const fetchHappyGiftsXML = async (): Promise<string> => {
  const url = 'https://happygifts.ru/XML/all_items_export.xlm';
  const res = await fetch(url);
  return res.text();
}

// --------------------
// 2. Организация данных
// --------------------

// Gifts
const mapGiftsCategories = async (rawData: IGiftsCategoriesNM): Promise<ICategory[]> => {
  const parseCategories = (data: IGiftsRawCategory[], parentId: string | null = null, level: number = 0): ICategory[] => {
    const categories: ICategory[] = [];

    data.forEach(item => {
      const category: ICategory = {
        id: toSourcedId(item.page_id[0], EDataSourceName.Gifts),
        name: item.name[0],
        parentId: parentId,
        level: level,
        sourceName: EDataSourceName.Gifts,
      };

      categories.push(category);

      if (item.page && item.page.length > 0) {
        const subCategories = parseCategories(item.page, category.id, level + 1);
        categories.push(...subCategories);
      }
    });

    return categories;
  };

  return parseCategories(rawData.doct.page[0].page, null, 0)
}

const mapGiftsProducts = async (rawData: any): Promise<IProduct[]> => {
  const productCatalogTree = await parseGiftsMatchesProductWithCatalog(rawData);

  const products: IProduct[] = [];

  rawData.doct.product.forEach((rawProduct: IGiftsRawProduct) => {
    const productId = rawProduct.product_id[0];
    const pCategory = productCatalogTree[productId];

    /**
     * Есть продукты с некорректными категориями, которые не входят в каталог.
     * Возможно, неправильно получены данные в productCatalogTree
     * */
    if (typeof pCategory === 'undefined') {
      return;
    }

    const imageUri = rawProduct.super_big_image[0].$.src
      .replace('thumbnails/', '')
      .replace('tb/', '')
      .replace('1000x1000', '2000x2000')
      .replace('.jpg', '.webp');
    const imageUrl = `https://files.gifts.ru/reviewer/webp/${imageUri}`;

    const pPrice = 'price' in rawProduct.price[0] ? rawProduct.price[0].price[0] : '0';
    const product: IProduct = {
      id: toSourcedId(productId, EDataSourceName.Gifts),
      name: rawProduct.name[0],
      brand: rawProduct.brand ? rawProduct.brand[0] : null,
      article: rawProduct.code ? rawProduct.code[0] : null,
      description: rawProduct.matherial ? rawProduct.matherial[0] : null,
      price: parseFloat(pPrice),
      categoryId: toSourcedId(pCategory, EDataSourceName.Gifts),
      sourceName: EDataSourceName.Gifts,
      pictures: [
        {url: imageUrl}
      ] as unknown as string
    };

    products.push(product);
  });

  return products
}

type TGiftsMatches = { [productId: string]: string };

const parseGiftsMatchesProductWithCatalog = async (rawData: IGiftsCategoriesNM): Promise<TGiftsMatches> => {
  const parseTree = (data: IGiftsRawCategory[]): TGiftsMatches => {
    const matches: TGiftsMatches = {};

    data.forEach(item => {
      if ('product' in item && item.product) {
        item.product.forEach(product => {
          matches[product.product[0]] = product.page[0];
        });
      }

      if (item.page && item.page.length > 0) {
        Object.assign(matches, parseTree(item.page));
      }
    });

    return matches;
  };

  return parseTree(rawData.doct.page);
}

// Oasis
const mapOasisCategories = async (rawData: IOasisCategories): Promise<ICategory[]> => {
  return rawData.response.item
    .map(rc => ({
      ...rc,
      parent_id: rc.parent_id[0] === '1906' ? [''] : rc.parent_id
    }))
    .filter(rc => rc.parent_id[0] !== '1906')
    .map((rawCategory: IOasisCategory) => {
      return {
        id: toSourcedId(rawCategory.id[0], EDataSourceName.Oasis),
        name: rawCategory.name[0],
        level: parseInt(rawCategory.level[0]) - 2,
        parentId: rawCategory.parent_id[0] !== ''
          ? toSourcedId(rawCategory.parent_id[0], EDataSourceName.Oasis)
          : null,
        sourceName: EDataSourceName.Oasis,
      };
    });
}

const mapOasisProducts = async (rawData: IOasisProducts): Promise<IProduct[]> => {
  const products: IProduct[] = [];

  rawData.yml_catalog.shop[0].offers[0].offer.forEach((rawItem: IOasisProduct) => {
    const product: IProduct = {
      id: toSourcedId(rawItem.$.id, EDataSourceName.Oasis),
      name: rawItem.name[0],
      article: rawItem.vendorCode[0],
      description: rawItem.description[0],
      price: parseFloat(rawItem.price[0]),
      categoryId: toSourcedId(rawItem.categoryId[0], EDataSourceName.Oasis),
      sourceName: EDataSourceName.Oasis,
      pictures: [
        {url: rawItem.picture[0]}
      ] as unknown as string
    };

    products.push(product);
  });

  return products
}

// HappyGifts
const mapHappyGiftsCategories = async (rawData: IHappyGiftsCatalog): Promise<ICategory[]> => {
  const mapCategories = (rawCategories: IHappyGiftsCategory[], parentId: string | null = null): ICategory[] => {
    const categories: ICategory[] = [];

    rawCategories.forEach((rawCategory) => {
      const sourcedCategoryId = toSourcedId(rawCategory.ID[0], EDataSourceName.HappyGifts);
      categories.push({
        id: sourcedCategoryId,
        name: rawCategory.NAME[0],
        level: parseInt(rawCategory.LEVEL[0]),
        parentId: parentId,
        sourceName: EDataSourceName.HappyGifts,
      });

      if ('SUB_Group' in rawCategory) {
        rawCategory.SUB_Group.forEach((subGroup) => {
          const subCategories = mapSubGroup(subGroup, sourcedCategoryId);
          categories.push(...subCategories);
        });
      }
    });

    return categories;
  };

  const mapSubGroup = (rawSubGroup: IHappyGiftsSubGroup, parentId: string): ICategory[] => {
    const categories: ICategory[] = [];
    const sourcedSubGroupId = toSourcedId(rawSubGroup.ID[0], EDataSourceName.HappyGifts);

    categories.push({
      id: sourcedSubGroupId,
      name: rawSubGroup.NAME[0],
      level: parseInt(rawSubGroup.LEVEL[0]),
      parentId: parentId,
      sourceName: EDataSourceName.HappyGifts,
    });

    if ('SUB_CHILD_Group' in rawSubGroup) {
      rawSubGroup.SUB_CHILD_Group.forEach((subChildGroup) => {
        const subChildCategories = mapSubChildGroup(subChildGroup, sourcedSubGroupId);
        categories.push(...subChildCategories);
      });
    }

    return categories;
  };

  const mapSubChildGroup = (rawSubChildGroup: IHappyGiftsSubChildGroup, parentId: string): ICategory[] => {
    return [
      {
        id: toSourcedId(rawSubChildGroup.ID[0], EDataSourceName.HappyGifts),
        name: rawSubChildGroup.NAME[0],
        level: parseInt(rawSubChildGroup.LEVEL[0]),
        parentId: parentId,
        sourceName: EDataSourceName.HappyGifts,
      },
    ];
  };

  return mapCategories(rawData.Catalog_items_export.Catalog_groups[0].Group);
}

const mapHappyGiftsProducts = async (rawData: IHappyGiftsCatalog): Promise<IProduct[]> => {
  const products: IProduct[] = [];

  rawData.Catalog_items_export.Items[0].Item.forEach((rawItem: IHappyGiftsItem) => {
    const pictures = (rawItem.SubItems[0]?.SubItem[0]?.Image || [])
    const product: IProduct = {
      id: toSourcedId(rawItem.ID[0], EDataSourceName.HappyGifts),
      brand: rawItem.BrendName ? rawItem.BrendName[0] : null,
      article: rawItem.Article[0],
      name: rawItem.NAME[0],
      categoryId: toSourcedId(rawItem.GROUP_ID[0], EDataSourceName.HappyGifts),
      price: parseFloat(rawItem.MinPrice[0]),
      sourceName: EDataSourceName.HappyGifts,
      pictures: pictures.map(url => ({url})) as unknown as string
    };

    products.push(product);
  });

  return products
}

/**
 * Удаляем категории без связей, или просто пустые
 * */
const filterCategories = (categories: ICategory[], products: IProduct[]) => {
  const hasProductsInCategory = (categoryId: string, categories: ICategory[], products: IProduct[]): boolean => {
    // Проверяем, есть ли продукт в данной категории
    const hasProductsInThisCategory = products.some(product => product.categoryId === categoryId);
    if (hasProductsInThisCategory) {
      return true;
    }

    // Если в категории нет продуктов, проверяем её подкатегории
    const subCategories = categories.filter(category => category.parentId === categoryId);
    for (const subCategory of subCategories) {
      // Рекурсивно проверяем подкатегории
      if (hasProductsInCategory(subCategory.id, categories, products)) {
        return true;
      }
    }

    return false; // Если ни в этой категории, ни в подкатегориях нет продуктов
  }

  // Фильтруем категории, оставляем только те, где есть продукты или подкатегории с продуктами
  return categories.filter(category => {
    return hasProductsInCategory(category.id, categories, products);
  });
}

// --------------------
// 3. Запись в БД
// --------------------
const writeToDb = async (categories: ICategory[], products: IProduct[]) => {
  console.log('Запись данных в БД...')

  await prisma.$transaction(async (tx) => {
    await tx.product.deleteMany();
    await tx.category.deleteMany();

    await tx.category.createMany({
      data: categories,
    });

    await tx.product.createMany({
      data: products,
    });
  }, {timeout: 60 * 1000});
}

// --------------------
// Главная функция
// --------------------
const main = async () => {
  try {
    console.log('Загрузка данных из источников...')
    const [giftsXml, happyXml, oasisCatXml, oasisProdXml] = await Promise.all([
      fetchGiftsXML('catalogue.xml'),
      fetchHappyGiftsXML(),
      fetchOasisXML('categories'),
      fetchOasisXML('products'),
    ]);

    console.log('Парсинг данных...')
    const parsedGiftsData = await parseStringPromise(giftsXml)
    const parsedHappyGiftsData = await parseStringPromise(happyXml)
    const parsedOasisCategoriesData = await parseStringPromise(oasisCatXml)
    const parsedOasisProductsData = await parseStringPromise(oasisProdXml)

    console.log('Обработка данных...')
    const giftsCategories = await mapGiftsCategories(parsedGiftsData);
    const giftsProducts = await mapGiftsProducts(parsedGiftsData);

    const happyGiftsCategories = await mapHappyGiftsCategories(parsedHappyGiftsData)
    const happyGiftsProducts = await mapHappyGiftsProducts(parsedHappyGiftsData)

    const oasisCategories = await mapOasisCategories(parsedOasisCategoriesData);
    const oasisProducts = await mapOasisProducts(parsedOasisProductsData);

    console.log('Сбор данных...')
    let categories = [
      ...giftsCategories,
      ...happyGiftsCategories,
      ...oasisCategories,
    ]

    const products = ([
      ...giftsProducts,
      ...happyGiftsProducts,
      ...oasisProducts,
    ])
      .map(p => ({
        ...p,
        price: p.price ? upPrice(p.price) : null,
        pictures: JSON.stringify(p.pictures)
      }))
      /**
       * (Замечено только за HappyGifts)
       * Товары, имеют категорию, которая не приходит в ответе запроса категорий этого источника.
       * Посему, приходится удалять эти товары из массива products путем фильтрации.
       * */
      .filter(p => categories.findIndex(c => p.categoryId === c.id) !== -1);

    categories = filterCategories(categories, products);

    await writeToDb(
      categories,
      products,
    );
    console.log('Импорт данных из завершён.');
  } catch (e) {
    console.error('Ошибка импорта:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
