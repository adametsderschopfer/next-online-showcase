'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IProduct } from "../../../../types";
import {clearCart, getCartItems, removeFromCart} from "@/lib/cart";
import {formatRubCurrency} from "@/lib/format";

const formSchema = z.object({
  name: z.string().min(2, { message: "Имя должно содержать не менее 2 символов." }),
  email: z.string().email({ message: "Введите корректный email адрес." }),
  phone: z.string().min(10, { message: "Введите корректный номер телефона." }),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<IProduct[]>([]);

  useEffect(() => {
    setCartItems(getCartItems());
  }, []);

  const totalAmount = cartItems.reduce((sum, item) => item.price ? sum + item.price : sum, 0);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const handleCheckoutClick = () => {
    setIsModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    const feedbackData = {
      ...data,
      products: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        sourceName: item.sourceName,
      })),
    };

    try {
      // Отправляем данные на сервер
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        reset();
        clearCart()
        setCartItems([])
        alert('Заявка отправлена, с вами свяжется менеджер!');
      } else {
        alert('Ошибка при отправке заявки');
      }
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
      alert('Ошибка при отправке заявки');
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId);
    setCartItems(getCartItems());
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-center mb-8">Корзина</h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Ваша корзина пуста.</p>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b py-3 pb-5">
                <p className="font-semibold max-w-[400px]">{item.name}</p>
                <p className="font-bold ml-auto mr-7">{item.price ? formatRubCurrency(item.price) : '0'}</p>
                <Button onClick={() => handleRemoveFromCart(item.id)}>Удалить</Button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center font-bold text-lg">
            <span>Итого:</span>
            <span>{formatRubCurrency(totalAmount)}</span>
          </div>

          <div className="mt-8 text-right">
            <Button onClick={handleCheckoutClick}>Оформить заявку</Button>
          </div>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Оформление заявки</DialogTitle>
            <DialogDescription>
              Введите ваши данные для оформления заявки.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Имя
                </Label>
                <Input id="name" {...register("name")} className="col-span-3"/>
                {errors.name &&
                  <p className="col-span-4 text-right text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Почта
                </Label>
                <Input id="email" type="email" {...register("email")} className="col-span-3"/>
                {errors.email &&
                  <p className="col-span-4 text-right text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Телефон
                </Label>
                <Input id="phone" type="tel" {...register("phone")} className="col-span-3" />
                {errors.phone &&
                  <p className="col-span-4 text-right text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="message" className="text-right">
                  Сообщение
                </Label>
                <Textarea id="message" {...register("message")} className="col-span-3" rows={4}/>
                {errors.message &&
                  <p className="col-span-4 text-right text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Отправить заявку</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
