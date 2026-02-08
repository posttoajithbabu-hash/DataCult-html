$(document).ready(function () {
  // Header Animation
  var didScroll;
  var lastScrollTop = 20;
  var delta = 20;
  var headerHeight = 0;
  var header = $('.header');
  // var contactLink = header.find('.contact-link');

  $(window).scroll(function (event) {
    didScroll = true;
  });

  setInterval(function () {
    if (didScroll) {
      hasScrolled();
      didScroll = false;
    }
  }, 250);

  function hasScrolled() {
    var st = $(this).scrollTop();

    if (Math.abs(lastScrollTop - st) <= delta) {
      return;
    }

    st > headerHeight ? (header).addClass('scrolled') : (header).removeClass('scrolled');
    // st > headerHeight + 20 ? contactLink.addClass('scrolled') : contactLink.removeClass('scrolled');

    // if (st > lastScrollTop && st > headerHeight + 40) {
    //   // Scroll Down
    //   $(header).addClass('header-hide');
    // } else {
    //   // Scroll Up
    //   // if (header.hasClass('header-transparent') && st > headerHeight + 100) {
    //   //   $(header).css('background', '#fff');
    //   // }
    //   // if (header.hasClass('header-transparent') && st < headerHeight + 100) {
    //   //   $(header).css('background', '#fff');
    //   // }
    //   $(header).removeClass('header-hide');
    // }

    lastScrollTop = st;
  }



  // hamburger-menu
  // Show and Hide Navbar Menu
  $(".hamburger").click(function () {
    $(".nav-items").toggleClass("open");
    $(".hamburger").toggleClass("open");
  })
});

// $(".hamburger").on("click", () => {
//   $(".nav-items").toggleClass("open");
//   $(".hamburger").toggleClass("open");
// });

// $(".hamburger").on("click", () => {
//   $(".nav-items").toggleClass("open");
//   $(".hamburger").toggleClass("open");
// });