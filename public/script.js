// Initialize ratings object
const ratings = {
  quality: 0,
  taste: 0,
  price: 0
};

// Render star ratings dynamically
function renderStars(type) {
  const container = document.querySelector(`.stars[data-rating="${type}"]`);
  if (!container) return;

  container.innerHTML = "";

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("i");
    star.className = "fas fa-star";
    star.setAttribute("data-value", i);
    star.classList.toggle("selected", i <= ratings[type]);
    star.addEventListener("click", () => {
      ratings[type] = i;
      renderStars(type);
    });
    container.appendChild(star);
  }
}

["quality", "taste", "price"].forEach(renderStars);

// Handle form submission
document.getElementById('feedbackForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const form = e.target;

  if (!form.name.value.trim() || !form.riceType.value || !form.comment.value.trim()) {
    alert('Please fill in all required fields.');
    return;
  }

  const riceType = form.riceType.value === "Other" && form.otherRiceType.value.trim() 
    ? form.otherRiceType.value.trim() 
    : form.riceType.value;

  const feedback = {
    name: form.name.value.trim(),
    riceType: riceType,
    rating: { ...ratings },
    comment: form.comment.value.trim()
  };

  try {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback)
    });

    if (res.ok) {
      alert('Thank you for your feedback!');
      form.reset();
      form.otherRiceType.value = '';
      ratings.quality = 0;
      ratings.taste = 0;
      ratings.price = 0;
      ["quality", "taste", "price"].forEach(renderStars);
      const modal = document.getElementById('successModal');
      if (modal) modal.style.display = 'flex';
    } else {
      const error = await res.text();
      alert(`Something went wrong: ${error || 'Please try again.'}`);
    }
  } catch (err) {
    console.error('Server error:', err);
    alert('Server error. Please try again later.');
  }
});

// Enhanced language toggle function
function setLang(lang) {
  if (!['en', 'hi', 'mr'].includes(lang)) {
    console.warn('Invalid language:', lang);
    return;
  }

  // Update text content for all elements with data attributes
  document.querySelectorAll('[data-en][data-hi][data-mr]').forEach(el => {
    el.textContent = el.dataset[lang] || el.dataset.en; // Fallback to English
    console.log(`Updated ${el.tagName} to: ${el.textContent}`); // Debug log
  });

  // Update placeholders and select options
  document.querySelectorAll('input, textarea, select, button').forEach(el => {
    if (el.placeholder && el.dataset[lang]) {
      el.placeholder = el.dataset[lang];
      console.log(`Updated placeholder for ${el.id || el.name} to: ${el.placeholder}`); // Debug log
    }
    if (el.tagName === 'SELECT' && el.id === 'riceType') {
      Array.from(el.options).forEach(option => {
        if (option.dataset[lang]) {
          option.textContent = option.dataset[lang];
          console.log(`Updated option ${option.value} to: ${option.textContent}`); // Debug log
        }
      });
    }
  });

  // Update HTML lang attribute
  document.documentElement.lang = lang;

  // Update active button class
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
}

// Initialize and attach event listeners
document.addEventListener('DOMContentLoaded', () => {
  setLang('en');

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = btn.getAttribute('data-lang');
      console.log(`Clicked language button: ${lang}`);
      setLang(lang);
    });
  });

  // Close modal functionality
  const closeModal = document.querySelector('.close-modal');
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      const modal = document.getElementById('successModal');
      if (modal) modal.style.display = 'none';
    });
  }
});