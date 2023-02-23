import { getAllOrder } from '../../api.js';
import { renderPageBtn, renderOrderList } from './renderDetail.js';
import { toggleLoadingSpinner } from '../../utils/loading.js';
import { $, $$ } from '../../utils/dom';

import { formatDate } from '../../utils/format.js';
let orders = [];

let activeIdx = 1;
let btnIdx = 1;
const itemsPerPage = 10;

/**현재 페이지의 거래내역 가져오기 */
const getOrderCurrentPage = (orders, activeIdx, itemsPerPage) => {
  const start = (activeIdx - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const newOrders = orders.slice(start, end);

  return newOrders;
};

/** 거래내역 목록 페이지 초기화 */
const setUpUI = (orderPageBtn, orderList) => {
  renderPageBtn(orderPageBtn, orders, activeIdx, itemsPerPage, btnIdx);
  newOrders = getOrderCurrentPage(orders, activeIdx, itemsPerPage);
  renderOrderList(orderList, newOrders, activeIdx);
};

let newOrders = getOrderCurrentPage(orders, activeIdx, itemsPerPage);

/** 거래내역관리 페이지 핸들러 */
export const orderHandler = async () => {
  toggleLoadingSpinner(true);

  const orderList = $('.order-container__list');
  const orderPageBtn = $('.order-container__btn-page');

  orders = await getAllOrder();
  console.log(orders);

  setUpUI(orderPageBtn, orderList);

  const searchedOrderInput = $(
    '.order-container__search-container--input input',
  );

  const searchOrderHandler = () => {
    const filteredOrder = orders.filter((order) =>
      order.user.displayName.includes(searchedOrderInput.value),
    );

    orders = filteredOrder;

    orderList.innerHTML = ``;
    renderPageBtn(orderPageBtn, filteredOrder, 1, itemsPerPage, 1);
    newOrders = getOrderCurrentPage(filteredOrder, 1, itemsPerPage);
    renderOrderList(orderList, newOrders, 1);
  };

  /** 거래내역 검색(enter) 이벤트 리스너 */
  searchedOrderInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.isComposing) {
      searchOrderHandler();
    }
  });

  searchedOrderInput.addEventListener('input', async () => {
    console.log(searchedOrderInput.value);
    searchedOrderInput.value === '' ? (orders = await getAllOrder()) : orders;
    searchOrderHandler();
  });

  /** 거래내역 검색(버튼 클릭) 이벤트 리스너 */
  // searchedOrderBtn.addEventListener('click', searchOrderHandler);

  /** 버튼 클릭 페이지 이동 이벤트 리스너 */
  orderPageBtn.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-page')) return;

    if (e.target.classList.contains('btn-page--number')) {
      let numberBtn = e.target;
      activeIdx = Number(numberBtn.textContent);

      if (activeIdx === btnIdx * itemsPerPage + 1) {
        btnIdx++;
      }

      if (activeIdx === (btnIdx - 1) * itemsPerPage) {
        btnIdx--;
      }
    }

    if (e.target.classList.contains('btn-page--next')) {
      activeIdx++;

      if (activeIdx > Math.ceil(orders.length / itemsPerPage) - 1) {
        activeIdx = Math.ceil(orders.length / itemsPerPage);
      }

      if (activeIdx === btnIdx * itemsPerPage + 1) {
        btnIdx++;
      }
    }

    if (e.target.classList.contains('btn-page--prev')) {
      activeIdx--;

      if (activeIdx < 1) {
        activeIdx = 1;
      }

      if (activeIdx === (btnIdx - 1) * itemsPerPage) {
        btnIdx--;
      }
    }
    orderList.innerHTML = ``;
    setUpUI(orderPageBtn, orderList);
  });

  toggleLoadingSpinner(false);
};
