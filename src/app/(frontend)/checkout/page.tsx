'use client';

import React, {useState, useEffect} from 'react';
import {useForm, Controller} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {IProduct} from "../../../../types";
import {clearCart, getCartItems, removeFromCart} from "@/lib/cart";
import {formatRubCurrency} from "@/lib/format";
import {Modal, Input, Button, Form, Row, Col, notification, Typography} from 'antd';

const {Title, Text} = Typography;

const formSchema = z.object({
  name: z.string().min(2, {message: "Имя должно содержать не менее 2 символов."}),
  email: z.string().email({message: "Введите корректный email адрес."}),
  phone: z.string().min(10, {message: "Введите корректный номер телефона."}),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CheckoutPage() {
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [cartItems, setCartItems] = useState<IProduct[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);  // Для отслеживания загрузки

  useEffect(() => {
    setCartItems(getCartItems());
  }, []);

  const totalAmount = cartItems.reduce((sum, item) => item.price ? sum + item.price : sum, 0);

  const {control, handleSubmit, formState: {errors}, reset} = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId);
    setCartItems(getCartItems());
  };

  const handleCheckoutClick = () => {
    setIsModalVisible(true);
  };

  const onSubmit = async (data: FormData) => {
    const feedbackData = {
      ...data,
      products: cartItems.map(item => ({
        product_id: item.id,
        article: item.article,
        name: item.name,
        price: item.price,
        sourceName: item.sourceName,
      })),
    };

    setLoading(true);
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        setIsModalVisible(false);
        reset();
        clearCart();
        setCartItems([]);

        notificationApi.success({
          message: 'Заявка отправлена!',
          description: 'Ваша заявка успешно отправлена, с вами свяжется менеджер.',
          placement: 'bottom',
        });
      } else {
        notificationApi.error({
          message: 'Ошибка',
          description: 'При отправке заявки возникла ошибка, попробуйте позднее!',
          placement: 'bottom',
        });
      }
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      {notificationContextHolder}

      <Title level={2} className="text-center mb-8">Корзина</Title>

      {cartItems.length === 0 ? (
        <Row justify="center" align="middle" style={{minHeight: '200px'}}>
          <Col>
            <Text className="text-center text-gray-600">Ваша корзина пуста.</Text>
          </Col>
        </Row>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="space-y-2">
            {cartItems.map((item) => (
              <Row key={item.id} className="border-b py-3 pb-5">
                <Col span={16}>
                  <Text strong>{item.name}</Text>
                </Col>
                <Col span={6} style={{textAlign: 'right'}}>
                  <Text strong>{item.price ? formatRubCurrency(item.price) : '0'}</Text>
                </Col>
                <Col span={2} style={{textAlign: 'right'}}>
                  <Button onClick={() => handleRemoveFromCart(item.id)} type="link">Удалить</Button>
                </Col>
              </Row>
            ))}
          </div>

          <Row className="mt-6" justify="space-between" align="middle">
            <Text strong>Итого:</Text>
            <Text strong>{formatRubCurrency(totalAmount)}</Text>
          </Row>

          <div className="mt-8 text-right">
            <Button type="primary" onClick={handleCheckoutClick}>Оформить заявку</Button>
          </div>
        </div>
      )}

      <Modal
        title="Оформление заявки"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
          <Form.Item
            label="Имя"
            validateStatus={errors.name ? 'error' : ''}
            help={errors.name?.message}
          >
            <Controller
              name="name"
              control={control}
              render={({field}) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({field}) => <Input type="email" {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Телефон"
            validateStatus={errors.phone ? 'error' : ''}
            help={errors.phone?.message}
          >
            <Controller
              name="phone"
              control={control}
              render={({field}) => <Input type="tel" {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Сообщение"
            validateStatus={errors.message ? 'error' : ''}
            help={errors.message?.message}
          >
            <Controller
              name="message"
              control={control}
              render={({field}) => <Input.TextArea {...field} rows={4}/>}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} disabled={loading}>
              {loading ? 'Отправка...' : 'Отправить заявку'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
