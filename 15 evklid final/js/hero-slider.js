const swiper = new Swiper('.js-hero-slider', {
  // Водном пролист один слайд
  slidesPerView: 1,
  // Бесконечная прокрутка
  loop: true,
  pagination: {
    el: '.js-hero-pagination',
    // кликабельность
    clickable: true,
  },

  a11y: {
    paginationBulletMessage: 'Перейти к слайду {{index}}'
  }
});
