import {CollectionConfig} from "payload";

const Feedback: CollectionConfig = {
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
      required: true,
    },
  ],
  access: {
    create: () => true,
    read: ({req}: any) => req.user?.role === 'admin',
    update: ({req}: any) => req.user?.role === 'admin',
    delete: ({req}: any) => req.user?.role === 'admin',
  },
};

export default Feedback;
