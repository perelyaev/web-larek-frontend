import {Component} from "./base/Component";
import {IProductItem} from "../types";
import {bem, createElement, ensureElement} from "../utils/utils";
import { isNull } from "lodash";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
    title: string;
    price: number;
    image?: string;
    category?: string;
    description?: string;
}

export class Card<T> extends Component<ICard<T>> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
        this._button = container.querySelector(`.${blockName}__button`);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set price(value: number) {
        if(isNull(value)) {value = 0}
        this.setText(this._price, String(value) + ' синапсов');
    }
}

export class CardCatalog<T> extends Card<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super('card', container);
        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._category = ensureElement<HTMLElement>(`.${blockName}__category`, container);
        this._button = container.querySelector(`.${blockName}__button`);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set category(value: string) {
        this.setText(this._category, value);
    }

    get category(): string {
        return this._category.textContent || '';
    }
    
}

export class CardItem<T> extends Card<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
        this._description = ensureElement<HTMLElement>(`.${blockName}__text`, container);
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    get description(): string {
        return this._description.textContent || '';
    }
}

