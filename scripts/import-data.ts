import fetch from 'node-fetch';
import {PrismaClient} from '@prisma/client';
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
    IHappyGiftsSubItem,
    IHappyGiftsSubItemDetail,
    IOasisCategories,
    IOasisCategory,
    IOasisProduct, IOasisProducts,
    IProduct,
    IProductVariant
} from "../types";

const PRICE_INCREASE_PERCENT = 20;
const upPrice = (price: number) => parseFloat((price * (1 + PRICE_INCREASE_PERCENT / 100)).toFixed(2));

const prisma = new PrismaClient();

// Заголовки авторизации
const GIFTS_AUTH = 'Basic ' + Buffer.from(`${process.env.GIFTS_RU_LOGIN}:${process.env.GIFTS_RU_PASSWORD}`).toString('base64');
const OASIS_AUTH = `${process.env.OASIS_API_KEY}`;

const toSourcedId = (id: string, sourceName: EDataSourceName) => `${id}_[${sourceName}]`

type TProductsParseResult = {
    products: IProduct[],
    variants: IProductVariant[]
}

// --------------------
// 1. Чтение данных
// --------------------
async function fetchGiftsXML(endpoint: string): Promise<string> {
    const url = `https://api2.gifts.ru/export/v2/catalogue/${endpoint}`;
    const res = await fetch(url, {headers: {Authorization: GIFTS_AUTH}});
    return res.text();
}

async function fetchOasisXML(path: string): Promise<string> {
    const url = `https://api.oasiscatalog.com/v4/${path}?key=${OASIS_AUTH}`;
    const res = await fetch(url);
    return res.text();
}

async function fetchHappyGiftsXML(): Promise<string> {
    const url = 'https://happygifts.ru/XML/all_items_export.xlm';
    const res = await fetch(url);
    return res.text();
}

// --------------------
// 2. Организация данных
// --------------------

// Gifts
async function parseGiftsCategories(xml: string): Promise<ICategory[]> {
    const rawData = await parseStringPromise(xml) as IGiftsCategoriesNM;
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

            // Если есть вложенные страницы, рекурсивно обрабатываем их
            if (item.page && item.page.length > 0) {
                const subCategories = parseCategories(item.page, category.id, level + 1);
                categories.push(...subCategories);
            }
        });

        return categories;
    };

    return parseCategories(rawData.doct.page)
        // Удаляем корневой элемент с наименование "Каталог"
        .filter(c => c.id !== toSourcedId('1', EDataSourceName.Gifts))
        .map(c => ({...c, parentId: c.parentId === toSourcedId('1', EDataSourceName.Gifts) ? null : c.parentId}))
}

async function parseGiftsProductsResult(xml: string): Promise<TProductsParseResult> {
    const rawData = await parseStringPromise(xml);
    const productCatalogTree = await parseGiftsMatchesProductWithCatalog(rawData);

    const products: IProduct[] = [];
    const variants: IProductVariant[] = [];

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

        const pPrice = 'price' in rawProduct.price[0] ? rawProduct.price[0].price[0] : '0';
        const product: IProduct = {
            id: toSourcedId(productId, EDataSourceName.Gifts),
            name: rawProduct.name[0],
            price: 'product' in rawProduct ? parseFloat(pPrice) : null,
            categoryId: toSourcedId(pCategory, EDataSourceName.Gifts),
            sourceName: EDataSourceName.Gifts,
        };

        products.push(product);

        if ('product' in rawProduct) {
            rawProduct.product.forEach((variant: IGiftsRawProduct['product'][0]) => {
                if (variant.main_product[0] === productId) {
                    variants.push({
                        id: toSourcedId(variant.product_id[0], EDataSourceName.Gifts),
                        productId: product.id,
                        name: variant.name[0],
                        value: variant.size_code[0],
                        price: parseFloat(variant.price[0].price[0]),
                        sourceName: EDataSourceName.Gifts,
                    });
                }
            });
        }
    });

    return {
        products,
        variants,
    }
}

type TGiftsMatches = { [productId: string]: string };

async function parseGiftsMatchesProductWithCatalog(rawData: IGiftsCategoriesNM): Promise<TGiftsMatches> {
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
async function parseOasisCategories(xml: string): Promise<ICategory[]> {
    const js = await parseStringPromise(xml) as IOasisCategories;
    return js.response.item.map((rawCategory: IOasisCategory) => {
        return {
            id: toSourcedId(rawCategory.id[0], EDataSourceName.Oasis),
            name: rawCategory.name[0],
            level: parseInt(rawCategory.level[0]),
            parentId: rawCategory.parent_id[0]
                ? toSourcedId(rawCategory.parent_id[0], EDataSourceName.Oasis)
                : null,
            sourceName: EDataSourceName.Oasis,
        };
    });
}

async function parseOasisProductsResult(xml: string): Promise<TProductsParseResult> {
    const js = await parseStringPromise(xml) as IOasisProducts;

    const products: IProduct[] = [];
    const variants: IProductVariant[] = [];

    js.yml_catalog.shop[0].offers[0].offer.forEach((rawItem: IOasisProduct) => {
        const product: IProduct = {
            id: toSourcedId(rawItem.$.id, EDataSourceName.Oasis),
            name: rawItem.name[0],
            description: rawItem.description[0],
            price: parseFloat(rawItem.price[0]),
            categoryId: toSourcedId(rawItem.categoryId[0], EDataSourceName.Oasis),
            sourceName: EDataSourceName.Oasis,
        };

        products.push(product);
    });

    return {products, variants};
}

// HappyGifts
async function parseHappyGiftsCategories(xml: string): Promise<ICategory[]> {
    const js = await parseStringPromise(xml) as IHappyGiftsCatalog;

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

    return mapCategories(js.Catalog_items_export.Catalog_groups[0].Group);
}

async function parseHappyGiftsProductsResult(xml: string): Promise<TProductsParseResult> {
    const js = await parseStringPromise(xml) as IHappyGiftsCatalog;

    const products: IProduct[] = [];
    const variants: IProductVariant[] = [];

    js.Catalog_items_export.Items[0].Item.forEach((rawItem: IHappyGiftsItem) => {
        const product: IProduct = {
            id: toSourcedId(rawItem.ID[0], EDataSourceName.HappyGifts),
            name: rawItem.NAME[0],
            categoryId: toSourcedId(rawItem.GROUP_ID[0], EDataSourceName.HappyGifts),
            price: null,
            sourceName: EDataSourceName.HappyGifts,
        };

        products.push(product);

        rawItem.SubItems.forEach((subItem: IHappyGiftsSubItem) => {
            subItem.SubItem.forEach((variant: IHappyGiftsSubItemDetail) => {
                const productVariant: IProductVariant = {
                    id: toSourcedId(variant.XML_ID[0], EDataSourceName.HappyGifts),
                    productId: product.id,
                    name: variant.NAME[0],
                    value: variant.Size[0],
                    price: parseFloat(variant.Price[0]),
                    sourceName: EDataSourceName.HappyGifts,
                };
                variants.push(productVariant);
            });
        });
    });

    return {products, variants};
}

// --------------------
// 3. Запись в БД
// --------------------
async function writeToDb(categories: ICategory[], products: IProduct[], productVariants: IProductVariant[] = []) {
    await prisma.$transaction(async (tx) => {
        await tx.product.deleteMany();
        await tx.productVariant.deleteMany();
        await tx.category.deleteMany();

        await tx.category.createMany({
            data: categories,
        });

        await tx.product.createMany({
            data: products,
        });

        // Добавляем варианты продуктов по одному
        for (const variant of productVariants) {
            try {
                await tx.productVariant.create({
                    data: variant,
                });
            } catch (error) {
                console.error(`Ошибка при добавлении варианта продукта: ${JSON.stringify(variant)}`, error);
                throw '';
            }
        }
    }, {timeout: 20000});
}

// --------------------
// Главная функция
// --------------------
async function main() {
    try {
        const [giftsXml, happyXml, oasisCatXml, oasisProdXml] = await Promise.all([
            fetchGiftsXML('catalogue.xml'),
            fetchHappyGiftsXML(),
            fetchOasisXML('categories'),
            fetchOasisXML('products'),
        ]);

        const giftsCategories = await parseGiftsCategories(giftsXml);
        const giftsProductsResult = await parseGiftsProductsResult(giftsXml);

        const happyGiftsCategories = await parseHappyGiftsCategories(happyXml)
        const happyGiftsProductsResult = await parseHappyGiftsProductsResult(happyXml)

        const oasisCategories = await parseOasisCategories(oasisCatXml);
        const oasisProductsResult = await parseOasisProductsResult(oasisProdXml);


        const categories = [
            ...giftsCategories,
            ...happyGiftsCategories,
            ...oasisCategories,
        ]

        /**
         * Есть товары, заметил только за HappyGifts которые
         * имеют категорию, которая не приходит в ответе запроса категорий этого источника.
         * Посему, приходится удалять эти товары из массива products путем фильтрации.
         * */
        const products = ([
            ...giftsProductsResult.products,
            ...happyGiftsProductsResult.products,
            ...oasisProductsResult.products,
        ])
            .map(p => ({
                ...p,
                price: p.price ? upPrice(p.price) : null,
            }))
            .filter(p => categories.findIndex(c => p.categoryId === c.id) !== -1);

        const productVariants = ([
            ...giftsProductsResult.variants,
            ...happyGiftsProductsResult.variants,
            ...oasisProductsResult.variants,
        ])
            .map(p => ({
                ...p,
                price: upPrice(p.price)
            }));

        await writeToDb(
            categories,
            products,
            productVariants,
        );
        console.log('Импорт из завершён.');
    } catch (e) {
        console.error('Ошибка импорта:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();