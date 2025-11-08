document.addEventListener("DOMContentLoaded", () => {
  const elementsToObserve = ['desc-1', 'desc-2'];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      } else {
        entry.target.classList.remove('fade-in');
      }
    });
  }, { threshold: 0.1 });

  elementsToObserve.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
  // Stagger feature reveal
  const features = document.querySelectorAll('.feature');
  features.forEach((el, i) => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(8px)';
    setTimeout(() => {
      el.style.transition = 'opacity .45s ease, transform .45s cubic-bezier(.22,.9,.32,1)';
      el.style.opacity = 1;
      el.style.transform = 'none';
    }, 120 * i + 120);
  });
  // Hero intro
  const heroLeft = document.querySelector('.hero-left');
  if (heroLeft) heroLeft.classList.add('animate-in');
});
