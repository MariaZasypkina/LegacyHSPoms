const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');

navToggle?.addEventListener('click', () => {
  const open = navLinks?.classList.toggle('show');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

// Close nav on link click for small screens
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (navLinks.classList.contains('show')) {
      navLinks.classList.remove('show');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// Smooth scrolling for internal anchors
const anchorLinks = document.querySelectorAll('a[href^="#"]');
anchorLinks.forEach(link => {
  link.addEventListener('click', evt => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      evt.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
