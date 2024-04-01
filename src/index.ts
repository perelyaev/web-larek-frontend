import './scss/styles.scss';

import {AuctionAPI} from "./components/AuctionAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import {Page} from "./components/Page";
import {Card, CardCatalog, CardItem} from "./components/Card";
import {AppState, CatalogChangeEvent, ProductItem} from "./components/AppData";
import {Modal} from "./components/common/Modal";
import {Basket} from "./components/common/Basket";
import {Order} from "./components/Order";

const events = new EventEmitter();
const api = new AuctionAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events)
const order = new Order(cloneTemplate(orderTemplate), events)

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
  page.catalog = appData.catalog.map(item => {
      const card = new CardCatalog('card', cloneTemplate(cardCatalogTemplate), {
          onClick: () => events.emit('card:select', item)
      });
      return card.render({
          title: item.title,
          image: item.image,
          price: item.price,
          category: item.category
      });
  });
});

// Открыть карточки
events.on('card:select', (card: ProductItem) => {
    const content = new CardItem('card', cloneTemplate(cardPreviewTemplate), {
      onClick: () => appData.setBasket(card)
    });
    modal.render({
        content: content.render({
          title: card.title,
          price: card.price,
          image: card.image,
          description: card.description,
          category: card.category
        })
    });
});

// Открыть корзину
events.on('basket:open', () => {
  basket.items = appData.basket.map(item => {
    const card = new Card('card' ,cloneTemplate(cardBasketTemplate), {
      onClick: () => console.log(1111)
    })
    return card.render({
      title: item.title,
      price: item.price,
  });
  })
  modal.render({
    content: basket.render({

    })
  });
});

// Открыть форму заказа
events.on('order:open', () => {
  modal.render({
      content: order.render({
          phone: '',
          email: '',
          valid: false,
          errors: []
      })
  });
});

// Обновить счетчик
events.on('total:update', (basket: ProductItem[]) => {
  page.counter = basket.length
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});``

// ... и разблокируем
events.on('modal:close', () => {
  page.locked = false;
});

// Получаем продукты с сервера
api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });