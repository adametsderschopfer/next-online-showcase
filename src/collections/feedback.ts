import {CollectionConfig} from "payload";

export const Feedback: CollectionConfig = {
  slug: 'feedback',
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
          name: 'id',
          type: 'text',
          label: 'ID продукта',
        },
        {
          name: 'name',
          type: 'text',
          label: 'Название продукта',
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

