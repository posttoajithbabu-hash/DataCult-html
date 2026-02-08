window.addEventListener('load', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const wrapper = document.querySelector('.impact-wrapper');
  const cardWrapper = document.querySelector('.impact-card-item-wrapper');

  if (!wrapper || !cardWrapper) return; 

  // Wait a bit to ensure all images and styles are rendered
  setTimeout(() => {
    ScrollTrigger.matchMedia({
      '(min-width: 992px)': () => {
        const setup = () => {
          // Calculate horizontal scroll distance
          // cardWrapper scrollWidth - wrapper clientWidth = distance to scroll left
          const scrollDistance = cardWrapper.scrollWidth - wrapper.clientWidth;

          // Kill existing triggers to avoid duplicates
          ScrollTrigger.getAll().forEach((st) => {
            if (st && (st.trigger === wrapper || st.trigger === cardWrapper)) st.kill();
          });

          gsap.to(cardWrapper, {
            x: -scrollDistance,
            ease: 'none',
            scrollTrigger: {
              trigger: wrapper,
              start: 'top 50px',
              end: () => `+=${scrollDistance}`,
              pin: true,
              scrub: true,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });
        };

        ScrollTrigger.addEventListener('refreshInit', setup);
        window.addEventListener('resize', () => ScrollTrigger.refresh());
        setup();
      },

      // Mobile: disable sticky and reset
      'all': () => {
        const existing = ScrollTrigger.getAll().find((s) => s.trigger === wrapper);
        if (existing) existing.kill();
        gsap.set(cardWrapper, { x: 0 });
      },
    });

    // Force refresh after setup to ensure correct calculations
    ScrollTrigger.refresh();
  }, 500);
});
