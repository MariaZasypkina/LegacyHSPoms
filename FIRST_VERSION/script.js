const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');
const parallaxEls = document.querySelectorAll('.parallax');

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 8);
};

const setParallax = () => {
  if (!parallaxEls.length) return;
  const offset = window.scrollY;
  parallaxEls.forEach(el => {
    const speed = parseFloat(el.dataset.parallax || '-0.05');
    el.style.transform = `translateY(${offset * speed}px)`;
  });
};

setHeaderState();
setParallax();
window.addEventListener('scroll', () => {
  setHeaderState();
  setParallax();
});

navToggle?.addEventListener('click', () => {
  const open = navLinks?.classList.toggle('show');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (navLinks.classList.contains('show')) {
      navLinks.classList.remove('show');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  });
});

// Smooth scroll for on-page anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', evt => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      evt.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Gallery filtering & lightbox (gallery page)
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryCards = Array.from(document.querySelectorAll('.gallery-card'));
const lightboxTargets = Array.from(document.querySelectorAll('[data-lightbox]'));
const lightbox = document.querySelector('.lightbox');
const lightboxImg = lightbox?.querySelector('.lightbox__img');
const lightboxCaption = lightbox?.querySelector('.lightbox__caption');
const lightboxClose = lightbox?.querySelector('.lightbox__close');
const lightboxPrev = lightbox?.querySelector('.lightbox__nav--prev');
const lightboxNext = lightbox?.querySelector('.lightbox__nav--next');
let lightboxList = lightboxTargets;
let currentIndex = 0;

const refreshLightboxList = (filter = 'all') => {
  if (galleryCards.length && filterButtons.length) {
    lightboxList = galleryCards.filter(card => {
      const match = filter === 'all' || card.dataset.team === filter;
      const visible = card.style.display !== 'none';
      return match && visible;
    });
  } else {
    lightboxList = lightboxTargets;
  }
};

const applyFilter = filter => {
  filterButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === filter));
  galleryCards.forEach(card => {
    const show = filter === 'all' || card.dataset.team === filter;
    card.style.display = show ? 'block' : 'none';
  });
  refreshLightboxList(filter);
};

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => applyFilter(btn.dataset.filter || 'all'));
});

const openLightbox = index => {
  if (!lightbox || !lightboxImg || !lightboxCaption || !lightboxList.length) return;
  currentIndex = index;
  const card = lightboxList[currentIndex];
  const imgEl = card.querySelector('img');
  const src = card.dataset.src || imgEl?.src || '';
  const captionText =
    card.dataset.caption ||
    card.querySelector('figcaption')?.textContent?.trim() ||
    imgEl?.alt ||
    'Legacy Poms photo';
  lightboxImg.src = src;
  lightboxImg.alt = captionText;
  lightboxCaption.textContent = captionText;
  lightbox.classList.add('open');
};

const closeLightbox = () => {
  lightbox?.classList.remove('open');
};

const showRelative = dir => {
  if (!lightboxList.length) return;
  currentIndex = (currentIndex + dir + lightboxList.length) % lightboxList.length;
  openLightbox(currentIndex);
};

lightboxTargets.forEach(card => {
  card.addEventListener('click', () => {
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    refreshLightboxList(activeFilter);
    const index = lightboxList.indexOf(card);
    if (index !== -1) {
      openLightbox(index);
    }
  });
});

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', evt => {
  if (evt.target === lightbox) closeLightbox();
});
lightboxPrev?.addEventListener('click', () => showRelative(-1));
lightboxNext?.addEventListener('click', () => showRelative(1));

document.addEventListener('keydown', evt => {
  if (!lightbox?.classList.contains('open')) return;
  if (evt.key === 'Escape') closeLightbox();
  if (evt.key === 'ArrowLeft') showRelative(-1);
  if (evt.key === 'ArrowRight') showRelative(1);
});

if (filterButtons.length) {
  applyFilter('all');
} else {
  refreshLightboxList();
}
