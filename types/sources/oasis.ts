export interface IOasisCategories {
    response: {
        item: IOasisCategory[]
    }
}

export interface IOasisProducts {
    yml_catalog: {
        shop: [
            {
                offers: [{
                    offer: IOasisProduct[]
                }]
            }
        ]
    }
}

export interface IOasisProduct {
    $: { id: string, available: 'true' | 'false' },
    url: string[];
    currencyId: string[];
    shortName: string[];
    name: string[];
    vendor: string[];
    vendorCode: string[];
    price: string[];
    categoryId: string[];
    picture: string[];
    description: string[];
    param: IOasisParam[];
    includedBranding: IOasisIncludedBranding[];
    dealerPrice: string[];
    fullCategories: string[];
    rating: string[];
    outlets: IOasisOutlet[];
}

export interface IOasisParam {
    _: string;
    $: {
        name: string;
        unit?: string;
    };
}

export interface IOasisIncludedBranding {
    id: string[];
    name: string[];
    size: string[];
    place: string[];
    setup: string[];
    isLocked: string[];
}

export interface IOasisOutlet {
    outlet: IOasisOutletDetail[];
}

export interface IOasisOutletDetail {
    $: {
        id: string;
        instock: string;
    };
}

export interface IOasisCategory {
    id: string[],
    parent_id: string[],
    root: string[],
    lft: string[],
    rgt: string[],
    level: string[],
    slug: string[],
    name: string[],
    path: string[],
    sort: string[],
    ltree_path: string[],
    ltree: string[],
}
