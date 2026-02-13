

$(document).ready(function () {



  $('.testimonial-slider').owlCarousel({
    loop: true,
    nav: true,
    dots: false,
    margin: 24,
    stagePadding: 0,
    items: 2,
    autoplay: true,
    autoplayTimeout: 3500,
    autoplayHoverPause: true,
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





  // Mobile submenu toggle: open submenu when nav item is clicked
  // Handle clicks on nav items (robust for div/button/anchor structures)
  $('.nav-items').on('click', function (e) {
    if ($(window).width() > 767) return;
    var $clickedList = $(e.target).closest('.nav-items-list');
    if ($clickedList.length === 0) return;

    // If click happened inside the submenu or on a submenu link, ignore (let link navigate)
    if ($(e.target).closest('.header-submenu-wrapper, .sub-menu-box, .menu-item').length) {
      return;
    }

    // If this list has a submenu, toggle it
    var hasSubmenu = $clickedList.find('.header-submenu-wrapper').length || $clickedList.find('.sub-menu-box').length;
    if (hasSubmenu) {
      e.preventDefault();
      $clickedList.toggleClass('submenu-open').siblings().removeClass('submenu-open');
    }
  });

  // Close open submenus when clicking outside (mobile)
  $(document).on('click', function (e) {
    if ($(window).width() <= 767) {
      if ($(e.target).closest('.nav-items-list').length === 0) {
        $('.nav-items-list.submenu-open').removeClass('submenu-open');
      }
    }
  });

});
