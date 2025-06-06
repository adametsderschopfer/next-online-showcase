'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Имя должно содержать не менее 2 символов." }),
  email: z.string().email({ message: "Введите корректный email адрес." }),
  message: z.string().optional(), // Сообщение опционально
});

type FormData = z.infer<typeof formSchema>;

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 'cart-1', name: 'Товар 1', price: 123.45, quantity: 1 },
    { id: 'cart-2', name: 'Товар 2 с длинным названием для теста', price: 999.99, quantity: 2 },
    { id: 'cart-3', name: 'Товар 3', price: 50.00, quantity: 3 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const handleCheckoutClick = () => {
    setIsModalOpen(true);
  };

  const onSubmit = (data: FormData) => {
    console.log('Данные формы (валидные):', data);
    alert('Заявка отправлена (фиктивно)! Смотрите данные в консоли.');
    setIsModalOpen(false);
    reset();
  };

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-center mb-8">Корзина</h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Ваша корзина пуста.</p>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.price.toFixed(2)} руб. x {item.quantity}</p>
                </div>
                <p className="font-bold">{(item.price * item.quantity).toFixed(2)} руб.</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center font-bold text-lg">
            <span>Итого:</span>
            <span>{totalAmount.toFixed(2)} руб.</span>
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
                <Input id="name" {...register("name")} className="col-span-3" />
                {errors.name && <p className="col-span-4 text-right text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Почта
                </Label>
                <Input id="email" type="email" {...register("email")} className="col-span-3" />
                {errors.email && <p className="col-span-4 text-right text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="message" className="text-right">
                  Сообщение
                </Label>
                <Textarea id="message" {...register("message")} className="col-span-3" rows={4} />
                {errors.message && <p className="col-span-4 text-right text-red-500 text-xs mt-1">{errors.message.message}</p>}
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