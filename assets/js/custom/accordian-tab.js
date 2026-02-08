
$(document).ready(function () {
  $('.nav-tabs li:first-child').addClass('active');
  $('.tab-text').removeClass('active');
  $('.tab-image').removeClass('active');
  $('.tab-text:first').addClass('active');
  $('.tab-image:first').addClass('active');

  // Click function resixe

  if ($(window).width() < 767) {
    $('.cycle-tab-item').removeClass('active');
    $('.nav-tabs li').click(function () {
      $(this).toggleClass('active');
      $(this).siblings().removeClass("active");
    });

  }
  else {
    $('.nav-tabs li').click(function () {
      $('.nav-tabs li').removeClass('active');
      $(this).addClass('active');
      $('.tab-text').removeClass('active');
      $('.tab-image').removeClass('active');

      var activeTab = $(this).find('.nav-link').attr('href');
      $(activeTab).addClass('active');
      return false;
    });


  }


});

// Get all the cycle-tab-item elements
const cycleTabItems = document.querySelectorAll('.cycle-tab-item');

let currentIndex = 0;
let intervalId;

function setActiveTab() {
  // Remove the active class from all elements
  cycleTabItems.forEach((item) => {
    item.classList.remove('active');
  });

  // Add the active class to the current element
  cycleTabItems[ currentIndex ].classList.add('active');

  // Calculate the index of the next element
  currentIndex = (currentIndex + 1) % cycleTabItems.length;
}



if ($(window).width() >= 767) {
  function startInterval() {
    intervalId = setInterval(setActiveTab, 10000);

    // if intervel timing is changed make change in css also in the progress-line animation timing
  }

  function stopInterval() {
    clearInterval(intervalId);
  }

}


// Set the initial active tab
setActiveTab();

// Set interval to switch tabs every 6 seconds
startInterval();

// Add event listeners for hover
cycleTabItems.forEach((item) => {
  item.addEventListener('mouseover', stopInterval);
  item.addEventListener('mouseout', startInterval);
});



