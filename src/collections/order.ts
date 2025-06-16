import {CollectionConfig} from "payload";

export const Order: CollectionConfig = {
  slug: 'order',
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Имя',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Телефон',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Сообщение',
      required: false,
    },
    {
      name: 'products',
      type: 'array',
      label: 'Список продуктов',
      required: false,
      admin: {
        readOnly: true,
        description: 'Список продуктов, связанный с этим отзывом (только для просмотра)',
        width: 'full',
      },
      fields: [
        {
          unique: false,
          name: 'product_id',
          type: 'text',
          label: 'ID продукта',
        },
        {
          name: 'name',
          type: 'text',
          label: 'Название продукта',
        },
        {
          name: 'article',
          type: 'text',
          label: 'Артикул',
        },
        {
          name: 'price',
          type: 'text',
          label: 'Цена',
        },
        {
          name: 'sourceName',
          type: 'text',
          label: 'Продукт из источника',
        },
      ],
    },
  ],
  access: {
    create: () => true,
  },
};

