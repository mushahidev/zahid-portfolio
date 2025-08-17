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

// Swiper Init
const swiper = new Swiper('.mySwiper', {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    768: { slidesPerView: 2 }, // tablet
    1024: { slidesPerView: 3 } // desktop
  }
});


// Modal Functions
function openModal(fullText) {
  document.getElementById('modalText').textContent = fullText;
  document.getElementById('testimonialModal').classList.remove('hidden');
}
function closeModal() {
  document.getElementById('testimonialModal').classList.add('hidden');
}

// Multi-step form logic
let currentStep = 0;
const steps = document.querySelectorAll(".form-step");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const submitBtn = document.getElementById("submitBtn");
const stepIndicator = document.getElementById("stepIndicator");
const stepHeading = document.getElementById("stepHeading");

// Array of step headings
const stepHeadings = [
  "Client Personal Info",
  "Business Info & Fiscal Year",
  "Bank & Credit Cards",
  "Software & Company Credentials",
  "Requirements & Calculator"
];

// Show the current step
function showStep(step) {
  steps.forEach((s, i) => s.classList.toggle("hidden", i !== step));
  prevBtn.classList.toggle("hidden", step === 0);
  nextBtn.classList.toggle("hidden", step === steps.length - 1);
  submitBtn.classList.toggle("hidden", step !== steps.length - 1);
  stepIndicator.textContent = `Step ${step + 1} of ${steps.length}`;
  if (stepHeading) stepHeading.textContent = stepHeadings[step] || "";
}

// Utility: show field error message
function showError(field, message) {
  let error = field.nextElementSibling;
  if (!error || !error.classList.contains("error-text")) {
    error = document.createElement("p");
    error.className = "error-text text-red-500 text-sm mt-1";
    field.parentNode.insertBefore(error, field.nextSibling);
  }
  error.textContent = message;
  field.classList.add("border-red-500");
}

// Clear field error
function clearError(field) {
  let error = field.nextElementSibling;
  if (error && error.classList.contains("error-text")) {
    error.textContent = "";
  }
  field.classList.remove("border-red-500");
}

// Handle Next button with validation
nextBtn.addEventListener("click", () => {
  const currentFields = steps[currentStep].querySelectorAll("input, textarea, select");
  let allValid = true;

  currentFields.forEach(field => {
    clearError(field);

    if (field.hasAttribute("required") && !field.value.trim()) {
      allValid = false;
      showError(field, "This field is required");
    } else if (field.type === "email" && field.value.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(field.value)) {
        allValid = false;
        showError(field, "Please enter a valid email");
      }
    }
  });

  if (!allValid) return;

  if (currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
  }
});

// Handle Previous button
prevBtn.addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
});

// Transaction Billing Calculator
const transactionsInput = document.getElementById("transactions");
const rateInput = document.getElementById("rate");
const billAmount = document.getElementById("billAmount");

function updateBill() {
  const t = parseInt(transactionsInput.value) || 0;
  const r = parseFloat(rateInput.value) || 0;
  billAmount.textContent = `$${(t * r).toFixed(2)}`;
}

if (transactionsInput && rateInput) {
  transactionsInput.addEventListener("input", updateBill);
  rateInput.addEventListener("input", updateBill);
}

// Auto years calculation based on Fiscal Year input
const fiscalInput = document.querySelector("input[name='fiscal_year']");
const numYearsInput = document.getElementById("num_years");

if (fiscalInput) {
  fiscalInput.addEventListener("input", () => {
    const match = fiscalInput.value.match(/(\d{4}).*?(\d{4})/);
    if (match) {
      const start = parseInt(match[1]);
      const end = parseInt(match[2]);
      numYearsInput.value = end - start + 1;
    }
  });
}

// Thank You Modal
const hireMeForm = document.getElementById("hireMeForm");
if (hireMeForm) {
  hireMeForm.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent default submission

    // Final validation on submit
    const allFields = hireMeForm.querySelectorAll("input, textarea, select");
    let formValid = true;
    allFields.forEach(field => {
      clearError(field);
      if (field.hasAttribute("required") && !field.value.trim()) {
        formValid = false;
        showError(field, "This field is required");
      } else if (field.type === "email" && field.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(field.value)) {
          formValid = false;
          showError(field, "Please enter a valid email");
        }
      }
    });

    if (!formValid) return;

    // Show Thank You modal
    document.getElementById("thankYouModal").classList.remove("hidden");

    // Reset form and return to first step
    hireMeForm.reset();
    currentStep = 0;
    showStep(currentStep);
  });
}

// Close Thank You modal
const closeThankYou = document.getElementById("closeThankYou");
if (closeThankYou) {
  closeThankYou.addEventListener("click", () => {
    document.getElementById("thankYouModal").classList.add("hidden");
  });
}

// Initialize first step
showStep(currentStep);

