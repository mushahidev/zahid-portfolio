// Dynamic year
document.getElementById('year').textContent = new Date().getFullYear();

// AOS init
AOS.init({ once: true, duration: 600, offset: 40 });

// Counter animation
const counters = document.querySelectorAll('.counter');
const speed = 300;

const runCounter = (counter) => {
  const target = +counter.getAttribute('data-target');
  const update = () => {
    const current = +counter.innerText;
    const increment = Math.ceil(target / speed);
    if (current < target) {
      counter.innerText = current + increment;
      requestAnimationFrame(update);
    } else {
      counter.innerText = target.toLocaleString();
    }
  };
  update();
};

// Trigger counters when in view
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      runCounter(entry.target);
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => io.observe(c));

// AJAX form submission
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.textContent = 'Sending…';
  const formData = new FormData(form);
  try {
    const res = await fetch('/', {
      method: 'POST',
      body: new URLSearchParams(formData).toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    if (res.ok) {
      status.textContent = 'Thanks! Your message has been sent.';
      form.reset();
    } else {
      status.textContent = 'Something went wrong. Please try again later.';
    }
  } catch (err) {
    status.textContent = 'Network error. Please try again.';
  }
});
