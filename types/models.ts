export enum EDataSourceName {
    Gifts = 'Gifts',
    HappyGifts = 'HappyGifts',
    Oasis = 'Oasis'
}

export interface ICategory {
    id: string;
    name: string;
    level: number;
    parentId?: string | null;
    sourceName: EDataSourceName
}

export interface IProduct {
    id: string
    name: string
    description?: string | null
    price?: number | null
    sourceName: EDataSourceName
    categoryId?: string | null
    pictures?: string // тут json массив {url: string}[]
}
