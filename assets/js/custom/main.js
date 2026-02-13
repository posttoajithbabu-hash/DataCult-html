

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
  $('.nav-items').on('click', '.nav-items-list > .nav-link', function (e) {
    var $link = $(this);
    var $parent = $link.parent();
    // check for either type of submenu container (desktop .sub-menu-box or .header-submenu-wrapper)
    var hasSubmenu = $parent.find('.sub-menu-box').length || $parent.find('.header-submenu-wrapper').length;
    if ($(window).width() <= 767 && hasSubmenu) {
      e.preventDefault();
      // toggle this submenu, close siblings
      $parent.toggleClass('submenu-open').siblings().removeClass('submenu-open');
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
