// Small UI helpers: back-to-top button and year injection
(function(){
  const btn = document.getElementById('back-to-top');
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function checkScroll(){
    if (!btn) return;
    const show = window.scrollY > 300;
    btn.style.display = show ? 'flex' : 'none';
  }

  window.addEventListener('scroll', checkScroll, {passive:true});
  document.addEventListener('DOMContentLoaded', checkScroll);

  if (btn) {
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      window.scrollTo({top:0,behavior:'smooth'});
    });
  }
})();
