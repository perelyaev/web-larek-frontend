import _ from "lodash";

import {Model} from "./base/Model";
import {FormErrors, IAppState, IProductItem, IOrder, IOrderForm} from "../types";

export type CatalogChangeEvent = {
    catalog: ProductItem[]
};

export class ProductItem extends Model<IProductItem> {
    catalog: ProductItem[];
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;

    getClosedProducts(): ProductItem[] {
        return this.catalog
    }
}

export class AppState extends Model<IAppState> {
    basket: ProductItem[] = [];
    catalog: ProductItem[];
    loading: boolean;
    order: IOrder = {
        email: '',
        phone: '',
        items: []
    };
    preview: string | null;
    formErrors: FormErrors = {};

    toggleOrderedLot(id: string, isIncluded: boolean) {
        if (isIncluded) {
            this.order.items = _.uniq([...this.order.items, id]);
        } else {
            this.order.items = _.without(this.order.items, id);
        }
    }

    getTotal() {
        return this.basket.length
    }

    setCatalog(items: IProductItem[]) {
        this.catalog = items.map(item => new ProductItem(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }


    getBasket() {
        return this.basket
    }

    setBasket(item: ProductItem) {
        if (!this.basket.length) {
            this.basket.push(item)
        } else {
            this.basket.forEach(product => {product.id !== item.id && this.basket.push(item)})
        }
        this.emitChanges('total:update', this.basket);
    }

    setPreview(item: ProductItem) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;

        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}