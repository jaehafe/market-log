import { addProduct } from './api.js';

export const productAddHandler = (page) => {
  const form = page.querySelector('.container-form');
  const productAddBtn = form.querySelector('.container-form__btn--add');
  const titleInput = form.querySelector(
    '.container-form__content--title input',
  );
  const priceInput = form.querySelector(
    '.container-form__content--price input',
  );
  const dscciptionInput = form.querySelector(
    '.container-form__content--description textarea',
  );
  const tagsSelect = form.querySelector(
    '.container-form__content--tags select',
  );
  const thumbnailInput = form.querySelector(
    '.container-form__content--thumbnail input',
  );
  const preview = document.querySelector(
    '.container-form__content--thumbnail img',
  );

  let profileImgBase64 = '';

  thumbnailInput.addEventListener('change', () => {
    const file = thumbnailInput.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', (e) => {
      console.log(e.target.result);
      profileImgBase64 = e.target.result;
      preview.src = e.target.result;
    });
  });

  console.log(profileImgBase64)

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const product = {
      title: titleInput.value,
      price: parseInt(priceInput.value),
      description: dscciptionInput.value,
      tags: [tagsSelect.value],
      thumbnail: profileImgBase64,
    };

    console.log(product);

    await addProduct(product);
  });
};
