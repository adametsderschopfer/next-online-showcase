export interface IGiftsRawCategory {
    page_id: string[];
    name: string[];
    uri: string[];
    page: IGiftsRawCategory[];
    '$'?: {
        parent_page_id: string;
    };
    product?: { page: string[], product: string[] }[],
}

export interface IGiftsCategoriesNM {
    doct: {
        page: IGiftsRawCategory[]
    }
}

export interface IGiftsProductsNM {
    doct: {
        product: IGiftsRawProduct[]
    }
}

export interface IGiftsRawProduct {
    product_id: string[];
    code: string[];
    group: string[];
    name: string[];
    product_size: string[];
    material: string[];
    content: string[];
    brand: string[];
    weight: string[];
    ondemand: string[];
    moq: string[];
    days: string[];
    small_image: Array<{ $: { src: string } }>;
    big_image: Array<{ $: { src: string } }>;
    super_big_image: Array<{ $: { src: string } }>;
    video: Array<{ $: object }>;
    status: Array<{ _: string; $: object }>;
    pack: Array<{
        amount: string[];
        weight: string[];
        volume: string[];
        sizex: string[];
        sizey: string[];
        sizez: string[];
        minpackamount: string[];
    }>;
    product: Array<{
        product_id: string[];
        main_product: string[];
        code: string[];
        name: string[];
        barcode: string[];
        size_code: string[];
        weight: string[];
        price: Array<{ price: string[] }>;
    }>;
    price: Array<{
        product: string[];
        price: string[];
        value: string[];
        name: string[];
    }>;
    print: Array<{ name: string[]; description: string[] }>;
    product_attachment: Array<{ image: string[]; meaning: string[]; name: string[] }>;
    filters: Array<{ filter: string[] }>;
    alerts: string[];
}
