

$(document).ready(function () {



  $('.testimonial-slider').owlCarousel({
    loop: false,
    nav: true,
    dots: false,
    margin: 24,
    stagePadding: 0,
    items: 2,
    autoplay: false,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      }
    }
  })

  $('.pop-up-btn').click(function () {
    $('#sourcePopup').addClass('active');
  });

  $('.close-source-popup').click(function () {
    $('#sourcePopup').removeClass('active');
  });

  $('#btnSubmit').click(function () {
    $('#thanksPopup').addClass('active');
    $('#sourcePopup').removeClass('active');
  });

  $('.form-content').submit(function (event) {
    event.preventDefault();
  });





});
