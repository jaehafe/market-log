//최상단버튼
// let toTop = document.querySelector('#to-top');

// window.addEventListener('scroll', () => {
//   let scrollY = window.scrollY;
//   if (scrollY > 200) {
//     toTop.classList.add('on');
//     if (scrollY < 200) {
//       toTop.classList.add('on');
//       // 색반전 주기
//     } else {
//       toTop.classList.remove('on');
//     }
//   }
// });
// toTop.addEventListener('click', (e) => {
//   e.preventDefault();
//   window.scrollTo({ top: 0, behavior: 'smooth' });
// });

// import * as signup from './page/signup';
// import * as productDetail from './page/productDetail/productDetail';
import { mpWeekly } from './renderMainPage.js';
//import { mpBestDesign, mpNewProduct, mpWeekly } from './renderMainPage.js';
import Navigo from 'navigo';
import { render } from 'sass';
const $ = (selector) => document.querySelector(selector);

/** navigo router */
const router = new Navigo('/');
// router.on({
//   '/': () => {
//     renderPage(mpWeekly);
//     // renderPage(mpNewProduct);
//     // renderPage(mpBestDesign);
//     console.log('contentsMainPage    contentsMainPage');
//   },
//   '/signup': () => {
//     console.log('signup    signup');
//   },
//   '/login': () => {
//     console.log('login    login');
//   },
//   '/cart': () => {
//     console.log('cart    cart');
//   },
//   '/hart': () => {
//     console.log('hart    hart');
//   },
//   '/mypage': () => {
//     console.log('mypage    mypage');
//   },
//   '/productDetail': () => {
//     console.log('productDetail    productDetail');
//   },
// });

/** 렌더 함수 for navigo */
const renderPage = (html) => {
  console.log(html);
  const mainPageAll = document.querySelector('.app');
  mainPageAll.innerHTML = html;
  //mainPageAll.innerHTML = '';
  //mainPageAll.append(html);
};

const renderInitMainPage = () => {
  renderPage(mpWeekly);
  // renderPage(mpNewProduct);
  // renderPage(mpBestDesign);
};

// renderInitMainPage();

// /** 메인페이지 초기화 */
const initMainPage = () => {
  renderPage();
};
// initMainPage();

/*-----------------------------------*\
  #상세 제품 불러오기 테스트
\*-----------------------------------*/

const BASE_URL = 'https://asia-northeast3-heropy-api.cloudfunctions.net/api';
masterKeyHEADERS = {
  'content-type': 'application/json',
  apikey: 'FcKdtJs202301',
  username: 'KDT4_Team3',
  masterKey: true,
};

const getAllProducts = async () => {
  try {
    const res = await fetch(`${BASE_URL}/products`, {
      headers: masterKeyHEADERS,
    });
    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
};

const renderProductIteminMainPageTemplate = `
  <div>
    <ul class="productDetailLists"></ul>
  </div>
`;

const renderProductItem = (items) => {
  const productItemTemplate = items
    .map((item) => {
      const { id, price, thumbnail, title, description, isSoldOut } = item;

      return `
    <li class="productDetailList" data-product-id="${id}">
      <a href="/product/${id}" data-navigo>
        <div>${id}</div>
        <div>${title}</div>
        <div>${price}</div>
        <div>${thumbnail}</div>
        <div>${description}</div>
        <div>${isSoldOut}</div>
      </a>
    </li>
    `;
    })
    .join('');

  $('.app').querySelector('.productDetailLists').innerHTML =
    productItemTemplate;
};

// 첫 화면 보여줄때
const initializeMainPage = async () => {
  renderPage(renderProductIteminMainPageTemplate);
  renderProductItem(await getAllProducts());
  console.log('initialize');
};
// window.addEventListener('DOMContentLoaded', (e) => {
//   initializeMainPage();
// });

// router
//   .on({
//     '/': async () => {
//       // renderPage(renderProductIteminMainPageTemplate);
//       console.log('working 144');
//       // renderProductItem(await getAllProducts());
//       initializeMainPage();
//     },
//     '/product/:id': async (params) => {
//       console.log(params);
//       console.log(params.data.id);
//       console.log('navigo params working');
//       await renderDetailProduct(params.data.id);
//     },
//   })
//   .resolve();
router
  .on({
    '/': async () => {
      console.log('/ route is working');
      // await initializeMainPage();
      await renderDetailProduct('4mZdaj6ioV9b0yXqLPKK');
    },
  })
  .resolve();

router
  .on({
    '/product/:id': async (params) => {
      console.log(params);
      console.log(params.data.id);
      console.log('product/:id route is working');
      await renderDetailProduct(params.data.id);
    },
  })
  .resolve();
// .resolve();
// router.navigate('product/:id');
// router.notFound(() => {
//   console.log('not found');
// });

/*-----------------------------------*\
  #productDetail js
\*-----------------------------------*/

// productDetail 제품 상세페이지
// 라우터 라이브러리
import Navigo from 'navigo';
// const router = new Navigo('/');
// import heart from '../../../../public/heart.svg';
// import cartSVG from '../../../../public/cart.svg';
import heart from '../../public/heart.svg';
import cartSVG from '../../public/cart.svg';
// import cartSVG from '../../../../public/cart.svg';
// const $ = (selector) => document.querySelector(selector);

/** 장바구니 localStorage */
export const shoppingCartStore = {
  setLocalStorage(product) {
    localStorage.setItem('shoppingCart', JSON.stringify(product));
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem('shoppingCart')) || [];
  },
  removeLocalStorage() {
    localStorage.removeItem('shoppingCart')[0];
  },
  clearLocalStorage() {
    localStorage.clear();
  },
};
let shoppingCartArr = [];
shoppingCartArr = shoppingCartStore.getLocalStorage();
console.log(shoppingCartArr);

/** 장바구니에 저장 */
const storeCart = (id, price, count, thumbnail, title, pricePerOne) => {
  // id 값을 찾고
  const existingItem = shoppingCartArr.find((item) => item.id === id);
  // 새로운 아이템이면 추가
  if (!existingItem) {
    shoppingCartArr.push({ id, price, count, thumbnail, title, pricePerOne });
    console.log('shoppingCartArr.push', shoppingCartArr);
    return;
  } else if (existingItem) {
    // 이미 아이템이면 기존 수량, 가격에 누적 추가
    existingItem.count += count;
    existingItem.price += price;
    return;
  }
  // shoppingCartStore.setLocalStorage(shoppingCartArr);
  console.log(shoppingCartArr);
};

// const BASE_URL = 'https://asia-northeast3-heropy-api.cloudfunctions.net/api';
HEADERS = {
  'content-type': 'application/json',
  apikey: 'FcKdtJs202301',
  username: 'KDT4_Team3',
};

/** 상세 제품 db에서 불러오기 */
const getDetailProduct = async (productId) => {
  try {
    const res = await fetch(`${BASE_URL}/products/${productId}`, {
      headers: HEADERS,
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
    console.log('err: ', '해당 제품을 불러오기 실패');
  }
};

/** 구매 수량 */
let productDetailProductQty = 1;
/** 총 상품 금액 */
let productDetailTotalPrice;
let productDetailTitle;
let productDetailThumbnail;
let productDetailPricePerOne;

const renderDetailProduct = async (productId) => {
  const productDetail = await getDetailProduct(productId);
  const { description, id, isSoldOut, photo, price, tags, title, thumbnail } =
    productDetail;
  console.log('productDetail', productDetail);

  // 총 금액 계산, 제품title, thumbnail
  productDetailTotalPrice = price * productDetailProductQty;
  productDetailTitle = title;
  productDetailThumbnail = thumbnail;
  productDetailPricePerOne = price;

  const productTags = tags
    .map((tag) => {
      return `<li class="aside__productDetail--info-tagLists-tag">${tag}</li>`;
    })
    .join('');

  /** 상세 제품 레이아웃 html */
  const detailProductTemplate = /* html */ `
  <div class="main-container" data-product-id="${id}">
    <section class="section__productDetail">
      <img
        src="${thumbnail}"
        alt="${title}"
      />
    </section>
    <aside class="aside__productDetail-menu">
      <div class="aside__productDetail--info">
        <h2 class="aside__productDetail--info-title" id="productDetail-title">
          ${title}
        </h2>
        <div class="aside__productDetail--info-sec">
          <div class="aside__productDetail--info-sec-price">
            ${price.toLocaleString()} 원
          </div>
          <div class="aside__productDetail--info-sec-wishlist">
            <button>
              <img src="${heart}" alt="찜하기 버튼" />
            </button>
          </div>
        </div>
        <p class="aside__productDetail--info-desc">
          ${description}
        </p>
        <ul class="aside__productDetail--info-tagLists">
          ${productTags}
        </ul>
      </div>

      <div class="aside__productDetail--count">
        <p class="aside__productDetail--count-buy">구매 수량</p>
        <div class="aside__productDetail--count-btns">
          <button class="aside__productDetail--count-btn minusQtyBtn">-</button>
          <span class="aside__productDetail--count-qty Qty" id="productDetailProductQty">${productDetailProductQty}</span>
          <button class="aside__productDetail--count-btn addQtyBtn">+</button>
        </div>
      </div>
      <div class="aside__productDetail--totalPrice">
        <p>총 상품 금액</p>
        <p id="productDetail-totalPrice">${productDetailTotalPrice.toLocaleString()}</p>
      </div>
      <div class="aside__productDetail--btns">
        ${
          !isSoldOut
            ? `<button class="aside__productDetail--btns-cart addCartBtn">장바구니에 담기</button>
        <button class="aside__productDetail--btns-buy buyBtn">구매하기</button>`
            : ` <button class="aside__productDetail--btns-soldOut">해당 상품은 품절입니다.</button>`
        }
      </div>
    </aside>
  </div>
  `;

  $('.app').innerHTML = detailProductTemplate;
};

const init = () => {
  if (shoppingCartStore.getLocalStorage().length > 0) {
    shoppingCartArr = shoppingCartStore.getLocalStorage();
  }

  renderDetailProduct('4mZdaj6ioV9b0yXqLPKK');
  // renderDetailProduct('UcGtdmglg7bzIFDosY9D');
  // shoppingCartStore.setLocalStorage(shoppingCartArr);
};
// init();

/** 렌더 함수 for navigo */

// const renderPage = (html) => {
//   $('.app').innerHTML = html;
// };

/** 구매수량 추가 핸들링 이벤트 */
$('.app').addEventListener('click', (e) => {
  updateInfo(e);
});

/** 구매수량 핸들링 함수 */
const updateInfo = async (e) => {
  // 구매수량 -
  if (e.target.classList.contains('minusQtyBtn')) {
    productDetailProductQty -= 1;
    if (productDetailProductQty === 0) {
      productDetailProductQty = 1;
    }

    renderDetailProduct('4mZdaj6ioV9b0yXqLPKK');
    // renderDetailProduct('UcGtdmglg7bzIFDosY9D');
    // shoppingCartStore.setLocalStorage(shoppingCartArr);
    return;
  }
  // 구매수량 +
  if (e.target.classList.contains('addQtyBtn')) {
    productDetailProductQty += 1;

    renderDetailProduct('4mZdaj6ioV9b0yXqLPKK');
    // renderDetailProduct('UcGtdmglg7bzIFDosY9D');
    return;
  }
  shoppingCartStore.setLocalStorage(shoppingCartArr);
};

/** 장바구니 담기 핸들 이벤트 */
$('.app').addEventListener('click', (e) => {
  pushInCart(e);
});

/** 장바구니 담기 핸들 함수 */
const pushInCart = (e) => {
  if (e.target.classList.contains('addCartBtn')) {
    const id = e.target.closest('.main-container').dataset.productId;
    const price = productDetailTotalPrice;
    const count = productDetailProductQty;
    const title = productDetailTitle;
    const thumbnail = productDetailThumbnail;
    const pricePerOne = productDetailPricePerOne;

    storeCart(id, price, count, thumbnail, title, pricePerOne);
    shoppingCartStore.setLocalStorage(shoppingCartArr);
    console.log('shoppingCartArr.push', shoppingCartArr);
  }
};

/** 모달 핸들 이벤트 */
document.body.addEventListener('click', (e) => {
  handleModal(e);
});

/** 모달 핸들 함수 */
const handleModal = (e) => {
  // '장바구니에 담기' 버튼 클릭 시, 모달 오픈
  if (e.target.classList.contains('addCartBtn')) {
    $('.modal__addCart').style.display = 'block';
    return;
  }

  // '모달 창 밖에 클릭 시 닫기'
  if (e.target !== $('.modal__addCart')) {
    $('.modal__addCart').style.display = 'none';
    return;
  }

  // '장바구니 바로가기' 버튼 클릭 시, navigo 장바구니로 가기
  if (e.target === $('.goToCart')) {
    $('.modal__addCart').style.display = 'none';
    return;
  }
};

/*-----------------------------------*\
  #cart js
\*-----------------------------------*/

let cartProductTotalPrice;

let cartTotalPaymentPrice; // [장바구니] 총 결제 금액
let cartTotalOrderPrice; // [장바구니] 총 주문 금액
let cartDiscountPrice = 0; // [장바구니] 할인 금액
let cartDeliveryPrice = 0; // [장바구니] 배송비

/** 장바구니 총 가격 렌더링 */
const renderCartPrice = () => {
  const cartTotalPrice = shoppingCartArr.map((items) => items.price);
  const cartTotalPriceReduce = cartTotalPrice.reduce((acc, val) => {
    return acc + val;
  }, 0);

  console.log(cartTotalPrice);
  console.log(cartTotalPriceReduce);
  cartTotalOrderPrice = cartTotalPriceReduce;
  console.log('cartTotalPaymentPrice', cartTotalPaymentPrice);
  console.log(typeof cartTotalOrderPrice);
  console.log(typeof cartDiscountPrice);
  console.log(typeof cartDeliveryPrice);
  return cartTotalOrderPrice;
};

// 장바구니 페이지 초기 렌더링
const renderInitCartPage = `
<section class="cart">
  <div class="cart__header"><h2>장바구니</h2></div>
  <div class="cart__container">
    <ul class="cart__list"></ul>

    <!-- 총 주문 금액 -->
    <aside class="cart__price"></aside>
  </div>
</section>
`;

/** 장바구니 결제금액 렌더링 */
const renderCartOrderPrice = () => {
  // [장바구니] 총 결제 금액
  cartTotalPaymentPrice =
    cartTotalOrderPrice + cartDiscountPrice + cartDeliveryPrice;
  const cartOrderPriceTemplate = `
  <div class="cart__price--border">
    <div class="cart__price--calc">
      <div class="cart__price--calc-orderPrice">
        <span class="cartOrderPrice">총 주문 금액</span>
        <p class="cartOrderPrice">${cartTotalOrderPrice.toLocaleString()} 원</p>
      </div>
      <div class="cart__price--calc-discountPrice">
        <span>할인 금액</span>
        <p class="cartDiscountPrice">0 원</p>
      </div>
      <div class="cart__price--calc-deliveryPrice">
        <span>배송비</span>
        <p class="cartDeliveryPrice">0 원</p>
      </div>
    </div>
    <div class="cart__price--total">
      <span>총 결제 금액</span>
      <p class="cartTotalPaymentPrice">${cartTotalPaymentPrice.toLocaleString()} 원</p>
    </div>
  </div>
  <a href="/order" data-navigo
    ><button class="cart__price--paymentBtn carPaymentBtn">
      결제하기
    </button></a
  >
`;
  $('.app').querySelector('.cart__price').innerHTML = cartOrderPriceTemplate;
};

const renderCartList = (storage) => {
  const cartListTemplate = storage
    .map((item) => {
      const { id, price, count, thumbnail, title } = item;
      cartProductTotalPrice = price;
      return `
    <li class="cart__item" data-product-id="${id}">
      <div class="cart__item-info">
        <div class="cart__item-info--checkbox">
          <input type="checkbox" checked />
        </div>
        <a href="#" data-navigo
          ><div class="cart__item-info--img">
            <img
              src="${thumbnail}"
              alt="${title}"
            /></div
        ></a>
        <a href="#" data-navigo
          ><span class="cart__item-info--title">
            ${title}
          </span></a
        >
      </div>
      <div class="cart__item--calc">
        <div class="cart__item--calc-count">
          <button class="cart-minusQtyBtn">-</button>
          <p class="cartProductQty">${count} 개</p>
          <button class="cart-addQtyBtn">+</button>
        </div>
        <span class="cart__item--price cartProductTotalPrice">${price.toLocaleString()} 원</span>
        <button class="cart__item--deleteBtn cartProductDeleteBtn">X</button>
      </div>
    </li>
    `;
    })
    .join('');

  renderCartPrice();
  renderCartOrderPrice();
  $('.app').querySelector('.cart__list').innerHTML = cartListTemplate;
};

router.on({
  '/cart': () => {
    $('.modal__addCart').style.display = 'none';
    // ul태그 삽입
    renderPage(renderInitCartPage);
    console.log('/cart');
    console.log('shoppingCartArr', shoppingCartArr);

    // 카트 페이지 렌더
    renderCartPage();
  },
});

// const cartListTemplate = shoppingCartArr
//   .map((item) => {
//     const { id, price, count, thumbnail, title } = item;
//     cartProductTotalPrice = price;
//     console.log('cartListTemplate', shoppingCartArr);
//     return `
//     <li class="cart__item" data-product-id="${id}">
//       <div class="cart__item-info">
//         <div class="cart__item-info--checkbox">
//           <input type="checkbox" checked />
//         </div>
//         <a href="#" data-navigo
//           ><div class="cart__item-info--img">
//             <img
//               src="${thumbnail}"
//               alt="${title}"
//             /></div
//         ></a>
//         <a href="#" data-navigo
//           ><span class="cart__item-info--title">
//             ${title}
//           </span></a
//         >
//       </div>
//       <div class="cart__item--calc">
//         <div class="cart__item--calc-count">
//           <button class="cart-minusQtyBtn">-</button>
//           <p class="cartProductQty">${count}</p>
//           <button class="cart-addQtyBtn">+</button>
//         </div>
//         <span class="cart__item--price cartProductTotalPrice">${price.toLocaleString()} 원</span>
//         <button class="cart__item--deleteBtn cartProductDeleteBtn">X</button>
//       </div>
//     </li>
//     `;
//   })
//   .join('');

const storeLocalStorage = (id) => {
  const existingItem = shoppingCartArr.find((item) => item.id === id);
  console.log('existingItem', existingItem);

  if (existingItem) {
    existingItem.price += existingItem.pricePerOne;
    existingItem.qty += 1;
    existingItem.count += 1;
    return;
  }
  // shoppingCartArr
  shoppingCartStore.setLocalStorage(shoppingCartArr);
  console.log('장바구니', shoppingCartArr);
};

/** 장바구니 페이지에서 수량 핸들링 */
$('.app').addEventListener('click', (e) => {
  const id = e.target.closest('li')?.dataset.productId;
  if (e.target.classList.contains('cart-addQtyBtn')) {
    storeLocalStorage(id);
    console.log(e.target);
    shoppingCartStore.setLocalStorage(shoppingCartArr);
    // 카트 페이지 렌더
    renderCartPage();
    // return;
  }

  // 구매수량 -
  if (e.target.classList.contains('cart-minusQtyBtn')) {
    const existingItem = shoppingCartArr.find((item) => item.id === id);
    console.log('existingItem', existingItem);

    if (existingItem) {
      if (existingItem.price > existingItem.pricePerOne) {
        existingItem.price -= existingItem.pricePerOne;
        // return;
      }
      if (existingItem.qty > 1) {
        existingItem.qty -= 1;
        // return;
      }
      if (existingItem.count > 1) {
        existingItem.count -= 1;
        // return;
      }

      shoppingCartStore.setLocalStorage(shoppingCartArr);
      // 카트 페이지 렌더
      // renderCartList(shoppingCartArr);
      renderCartPage();
      // return;
    }
    return;
  }

  // 장바구니에서 삭제
  if (e.target.classList.contains('cartProductDeleteBtn')) {
    shoppingCartArr = shoppingCartArr.filter((item) => item.id !== id);
    renderCartPage();
  }
});

/** 빈 장바구니일 때 화면에 표시 */
const renderInitEmptyCartPage = `
    <div class="cart__empty">
      <img src="${cartSVG}" alt="빈 장바구니" />
      <h3>장바구니가 비었습니다.</h3>
      <a href="/" data-navigo><button>쇼핑하러 가기</button></a>
    </div>
  `;

/** 로운님한테 innerHTML 로직 요청 */
router.on({
  '/': () => {
    // main 홈페이지로 이동
    console.log('쇼핑하러 가기');
  },
});

/** 빈 장바구니일 때, 상품이 있는 장바구니일 때 */
const renderCartPage = () => {
  if (shoppingCartArr.length === 0) {
    $('.app').querySelector('.cart__list').innerHTML = renderInitEmptyCartPage;
    // renderCartPrice();
    return;
  } else if (shoppingCartArr.length > 0) {
    // 장바구니에 넣은 상품 렌더링
    renderCartList(shoppingCartArr);
    // 결제금액 렌더링
    renderCartPrice();
    return;
  }
  // renderCartPrice();
  // return;
};
