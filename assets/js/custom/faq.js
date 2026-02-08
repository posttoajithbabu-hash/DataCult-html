let accordionHeaders = document.querySelectorAll(".accordian-head");
accordionHeaders.forEach(accordionHeaders => {
  accordionHeaders.addEventListener("click", event => {
    const active = document.querySelector(".accordian-head.active");
    if (active && active !== accordionHeaders) {
      active.classList.toggle("active");
      active.parentElement.classList.remove("active");
      active.nextElementSibling.style.height = 0;
    }
    accordionHeaders.classList.toggle("active");
    accordionHeaders.parentElement.classList.toggle("active");
    const answer = accordionHeaders.nextElementSibling;
    if (accordionHeaders.classList.contains("active")) {
      answer.style.height = answer.scrollHeight + "px";
    } else {
      answer.style.height = 0;
    }
  })
})

accordionHeaders[ 0 ].classList.add('active');
accordionHeaders[ 0 ].parentElement.classList.add("active");
accordionHeaders[ 0 ].nextElementSibling.style.height = accordionHeaders[ 0 ].nextElementSibling.scrollHeight + 'px';
// $("accordian-head").hasClass("active")