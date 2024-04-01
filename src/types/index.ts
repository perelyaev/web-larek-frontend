export type PaymentMethod = 'Онлайн' | 'При получении';

export interface IProductItem {
  id: string;
  description: string;
  image: string;
  title?: string;
  category: string;
  price: number;
}

// Форма доставки
export interface IDeliveryForm {
  method: PaymentMethod;
  address: string;
}

// Форма заказа
export interface IOrderForm {
  email: string;
  phone: string;
}

// Корзина
export interface IOrder extends IOrderForm {
  items: string[]
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
  id: string;
  total: number
}

export interface IAppState {
  catalog: IProductItem[];
  preview: string | null;
  order: IOrder | null;
  loading: boolean;
}