// Global init
document.addEventListener('DOMContentLoaded', async () => {
  // Auth status / nav updates
  await checkAuthStatus();

  // Contact form handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for your message! We will get back to you soon.');
      contactForm.reset();
    });
  }

  // Scroll reveal for luxury cards
  const revealItems = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window && revealItems.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.25,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealItems.forEach(el => observer.observe(el));
  }

  // About page interactive story
  const storySteps = document.querySelectorAll('.story-step');
  const storyCards = document.querySelectorAll('.story-card');

  if (storySteps.length && storyCards.length) {
    storySteps.forEach(step => {
      step.addEventListener('click', () => {
        const key = step.getAttribute('data-story');

        storySteps.forEach(s => s.classList.remove('is-active'));
        step.classList.add('is-active');

        storyCards.forEach(card => {
          if (card.getAttribute('data-story-panel') === key) {
            card.classList.add('is-visible');
          } else {
            card.classList.remove('is-visible');
          }
        });
      });
    });
  }
});

// ---- Auth helpers ----
function setNavItemVisible(anchorEl, visible) {
  if (!anchorEl) return;
  const li = anchorEl.closest('li');
  if (li) li.style.display = visible ? '' : 'none';
  anchorEl.style.display = visible ? '' : 'none';
}


async function checkAuthStatus() {
  const registerLink = document.getElementById('registerLink');
  const loginLink = document.getElementById('loginLink');
  const accountLink = document.getElementById('accountLink');
  const logoutLink = document.getElementById('logoutLink');
  if (!registerLink || !loginLink || !accountLink || !logoutLink) return;

  const res = await fetch('/api/user', { cache: 'no-store' });
  const data = await res.json();

  if (data.loggedIn) {
    setNavItemVisible(registerLink, false);
    setNavItemVisible(loginLink, false);

    setNavItemVisible(accountLink, true);
    accountLink.textContent = 'Account';
    accountLink.href = 'login.html';

    setNavItemVisible(logoutLink, true);
    logoutLink.removeEventListener('click', logout);
    logoutLink.addEventListener('click', logout);
  } else {
    setNavItemVisible(registerLink, true);
    setNavItemVisible(loginLink, true);

    setNavItemVisible(accountLink, false);
    setNavItemVisible(logoutLink, false);
    logoutLink.removeEventListener('click', logout);
  }
}

async function logout(e) {
  e.preventDefault();
  try {
    await fetch('/api/logout', { method: 'POST' });
    // After logout, refresh nav immediately and go home
    await checkAuthStatus();
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Logout failed:', error);
  }
}

// Expose a refresh function so login.html can update the navbar instantly after login
window.refreshAuthUI = checkAuthStatus;

// Navbar scroll behavior (unchanged)
(() => {
  const nav = document.querySelector(".navbar");
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();
