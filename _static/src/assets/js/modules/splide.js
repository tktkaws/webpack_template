// home-mvのスライダー
var splide2 = new Splide('#splide2', {
  autoplay: true,
  interval: 2500,
  pauseOnHover: false,
  type: 'fade',
  rewind: true,
  speed: 1500,
  padding: '0%',
  perPage: 1,
  perMove: 1,
  wheel: false,
  mediaQuery: 'min',
  trimSpace: false,
  arrows: false,
  pagination: false,
  updateOnMove: false,
});

// プログレスバー
var bar = splide2.root.querySelector('.my-slider-progress-bar');

// Update the bar width:
splide2.on('mounted move', function () {
  var end = splide2.Components.Controller.getEnd() + 1;
  bar.style.width = String((100 * (splide2.index + 1)) / end) + '%';
});

splide2.mount();

// home-testのスライダー
var splide = new Splide('#splide1', {
  autoplay: true,
  type: 'loop',
  speed: 600,
  padding: '0%',
  perPage: 1,
  perMove: 1,
  wheel: true,
  mediaQuery: 'min',
  releaseWheel: true,
  trimSpace: false,

  updateOnMove: false,
  breakpoints: {
    769: {
      perPage: 3,
      fixedWidth: '32%',
      gap: '2%',
      focus: 'center',
      trimSpace: 'false',
    },
    1280: {
      perPage: 4,
      fixedWidth: '23.5%',
      focus: false,
    },
  },
});

splide.mount();
