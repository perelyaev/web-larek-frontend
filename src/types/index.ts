// Методы запросов к серверу
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Ответ от сервера
export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

// Реализация Event
export type EventName = string | RegExp;
export type Subscriber = Function;
export type EmitterEvent = {
    eventName: string,
    data: unknown
};


// Данные о товаре
export interface IProductItem {
    id: string;
    title: string;
    description?: string;
    image?: string;
    category: string;
    price: number | null;
}

// Состояние приложения
export interface IAppState {
    catalog: IProductItem[];
    basket: IProductItem[];
    preview: string | null;
    contact: IContactsForm | null;
    delivery: IDeliveryForm | null;
    order: IOrderForm | null;
}

// Форма контактов
export interface IContactsForm {
    email: string;
    phone: string;
}

// Форма доставки
export interface IDeliveryForm {
    payment: string;
    address: string;
}

// Форма данных заказа
export interface IOrderForm extends IDeliveryForm, IContactsForm {
    total: number;
    items: string[];
}


// Ответ сервера на заказ
export interface IOrderResult {
    id: string;
    total: number;
}


// Компоненты представления

// Отображение страницы
export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

// Отображение карточки
export interface ICard extends IProductItem {
    count?: string;
    buttonText?: string;
}


// Отображение успешного оформления заказа
export interface ISuccess {
    total: number | null;
}

// Отображение корзины
export interface IBasketView {
    items: HTMLElement[];
    total: number;
}

// Валидность формы
export interface IFormState {
    valid: boolean;
    errors: string[];
}

// Ошибки форм
export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

//модальное окно
export interface IModalData {
    content: HTMLElement;
}

// Методы для API приложения
export interface ILarekAPI {
    getCardList: () => Promise<ICard[]>;
    // getCard: (id: string) => Promise<ICard>;
    orderItems: (order: IOrderForm) => Promise<IOrderResult>;
}


export interface IActions {
    onClick: (event: MouseEvent) => void;
}
  
export interface ISuccessActions {
    onClick: () => void;
}