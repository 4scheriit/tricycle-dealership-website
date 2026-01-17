// Global init
document.addEventListener('DOMContentLoaded', async () => {
    // Auth status / nav login-logout
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

async function checkAuthStatus() {
    try {
        const response = await fetch('/api/user');
        const data = await response.json();

        const authLink = document.getElementById('authLink');
        if (authLink && data.loggedIn) {
            authLink.textContent = `Logout (${data.username})`;
            authLink.href = '#';
            authLink.addEventListener('click', logout);
        }
    } catch (error) {
        console.log('Auth check failed:', error);
    }
}

async function logout(e) {
    e.preventDefault();
    try {
        await fetch('/api/logout', { method: 'POST' });
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout failed:', error);
    }
}

(() => {
  const nav = document.querySelector(".navbar");
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();