(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (!preference.matches) entry.target.classList.add('arriving');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.06 });
  document.querySelectorAll('.work').forEach(work => observer.observe(work));
  preference.addEventListener('change', () => {
    if (preference.matches) {
      observer.disconnect();
      document.querySelectorAll('.arriving').forEach(work => work.classList.remove('arriving'));
    }
  });
})();
