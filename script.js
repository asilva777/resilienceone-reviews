// ====== Configuration ======
const COUNTRY_OPTIONS = [
  "Philippines", "India", "Indonesia", "Malaysia", "Vietnam", "Thailand", "Japan", "South Korea",
  "Bangladesh", "Nepal", "Pakistan", "Sri Lanka", "Singapore", "Other"
];
const RATING_OPTIONS = [
  { value: "5", label: "★★★★★ - Excellent" },
  { value: "4", label: "★★★★ - Good" },
  { value: "3", label: "★★★ - Average" },
  { value: "2", label: "★★ - Poor" },
  { value: "1", label: "★ - Very Poor" },
];

// ====== Utility Functions ======
function sanitize(str) {
  return String(str).replace(/[&<>"'`=\/]/g, s => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    '`': '&#96;', '=': '&#61;', '/': '&#47;'
  }[s]));
}

// ====== DOM Elements ======
const reviewList = document.getElementById('reviewList');
const rollingFeed = document.getElementById('rollingFeed');
const reviewForm = document.getElementById('reviewForm');
const addReviewBtn = document.getElementById('addReviewBtn');
const successMsg = document.getElementById('successMsg');
const errorMsg = document.getElementById('errorMsg');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');
const loadingIndicator = document.getElementById('loadingIndicator');

// ====== Dynamic Select Options ======
function populateSelectOptions() {
  const countrySelect = document.getElementById('country');
  countrySelect.innerHTML = `<option value="">Select Country</option>` +
    COUNTRY_OPTIONS.map(c => `<option>${c}</option>`).join('');
  const ratingSelect = document.getElementById('rating');
  ratingSelect.innerHTML = `<option value="">Rating (1 to 5)</option>` +
    RATING_OPTIONS.map(r => `<option value="${r.value}">${r.label}</option>`).join('');
}

// ====== Reviews State ======
let reviews = [];
let ratingPieChart, countryBarChart;

// ====== Fetch and Render ======
async function fetchReviews() {
  loadingIndicator.style.display = "block";
  try {
    const res = await fetch('/api/reviews');
    reviews = await res.json();
    renderReviews();
    renderRollingFeed();
    updateCharts();
    loadingIndicator.style.display = "none";
  } catch (e) {
    reviewList.innerHTML = '<div class="error-message">Failed to load reviews. Please try again later.</div>';
    loadingIndicator.style.display = "none";
  }
}

function renderReviews() {
  reviewList.innerHTML = '';
  reviews.forEach(r => {
    reviewList.innerHTML += `
      <article class="review">
        <strong>${sanitize(r.name)} (${sanitize(r.country)}) – ${r.rating}★</strong>
        <p>${sanitize(r.comment)}</p>
      </article>`;
  });
}

function renderRollingFeed() {
  let rollingContent = '';
  reviews.forEach(r => {
    rollingContent += `<span class="rolling-review">⭐ ${r.rating} — "${sanitize(r.comment)}" <b>- ${sanitize(r.name)} (${sanitize(r.country)})</b></span>`;
  });
  rollingFeed.innerHTML = rollingContent + rollingContent;
  rollingFeed.style.willChange = 'transform';
}

function updateCharts() {
  // Rating distribution
  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) ratingCounts[r.rating - 1]++;
  });
  // Country distribution (top 8, rest grouped as "Other")
  const countryMap = {};
  reviews.forEach(r => {
    countryMap[r.country] = (countryMap[r.country] || 0) + 1;
  });
  const sortedCountries = Object.entries(countryMap).sort((a, b) => b[1] - a[1]);
  const topCountries = sortedCountries.slice(0, 8);
  const otherCount = sortedCountries.slice(8).reduce((sum, [, v]) => sum + v, 0);
  const countryLabels = topCountries.map(([k]) => k);
  if (otherCount > 0) countryLabels.push("Other");
  const countryData = topCountries.map(([, v]) => v);
  if (otherCount > 0) countryData.push(otherCount);

  // Pie Chart for Ratings
  if (ratingPieChart) ratingPieChart.destroy();
  const pieCtx = document.getElementById('ratingPieChart').getContext('2d');
  ratingPieChart = new Chart(pieCtx, {
    type: 'pie',
    data: {
      labels: ["1★", "2★", "3★", "4★", "5★"],
      datasets: [{
        data: ratingCounts,
        backgroundColor: [
          "#ff7979", "#f6e58d", "#badc58", "#7ed6df", "#6ab04c"
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Rating Distribution' },
        legend: { position: 'bottom' }
      }
    }
  });

  // Bar Chart for Countries
  if (countryBarChart) countryBarChart.destroy();
  const barCtx = document.getElementById('countryBarChart').getContext('2d');
  countryBarChart = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: countryLabels,
      datasets: [{
        data: countryData,
        backgroundColor: "#52c41a"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Reviews by Country' },
        legend: { display: false }
      },
      scales: {
        x: { title: { display: true, text: 'Country' }},
        y: { beginAtZero: true, title: { display: true, text: 'Count' }, ticks: { precision:0 } }
      }
    }
  });
}

// ====== Form Handling ======
function toggleForm() {
  reviewForm.style.display = reviewForm.style.display === "none" || reviewForm.style.display === "" ? "block" : "none";
  successMsg.style.display = 'none';
  errorMsg.style.display = 'none';
  clearInlineErrors();
}

function clearInlineErrors() {
  ['nameError', 'emailError', 'countryError', 'ratingError', 'commentError'].forEach(id => {
    document.getElementById(id).textContent = '';
  });
}

function validateForm() {
  let valid = true;
  clearInlineErrors();

  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const country = document.getElementById('country');
  const rating = document.getElementById('rating');
  const comment = document.getElementById('comment');
  const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  if (!name.value.trim() || name.value.length > 50) {
    document.getElementById('nameError').textContent = "Please enter your name (max 50 chars).";
    valid = false;
  }
  if (!email.value.trim() || !emailPattern.test(email.value) || email.value.length > 100) {
    document.getElementById('emailError').textContent = "Enter a valid email (max 100 chars).";
    valid = false;
  }
  if (!country.value.trim()) {
    document.getElementById('countryError').textContent = "Please select a country.";
    valid = false;
  }
  if (!rating.value.trim()) {
    document.getElementById('ratingError').textContent = "Please select a rating.";
    valid = false;
  }
  if (!comment.value.trim() || comment.value.length > 500) {
    document.getElementById('commentError').textContent = "Comment is required (max 500 chars).";
    valid = false;
  }

  return valid;
}

reviewForm.addEventListener('submit', async function(e){
  e.preventDefault();
  successMsg.style.display = 'none';
  errorMsg.style.display = 'none';
  formStatus.textContent = "Submitting your review...";
  formStatus.style.display = "block";
  submitBtn.disabled = true;

  if (!validateForm()) {
    formStatus.style.display = 'none';
    submitBtn.disabled = false;
    errorMsg.textContent = "Please fill in all fields correctly.";
    errorMsg.style.display = 'block';
    return;
  }

  // Confirmation dialog
  if (!window.confirm("Are you sure you want to submit your review?")) {
    formStatus.style.display = 'none';
    submitBtn.disabled = false;
    return;
  }

  const name = sanitize(document.getElementById('name').value.trim());
  const country = sanitize(document.getElementById('country').value);
  const rating = parseInt(document.getElementById('rating').value);
  const comment = sanitize(document.getElementById('comment').value.trim());

  try {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, country, rating, comment })
    });
    if (!res.ok) throw new Error('Server error');
    await fetchReviews();
    reviewForm.reset();
    reviewForm.style.display = "none";
    formStatus.style.display = 'none';
    submitBtn.disabled = false;
    successMsg.textContent = "Thank you for your review!";
    successMsg.style.display = 'block';
    // Scroll to reviews section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (e) {
    formStatus.style.display = 'none';
    submitBtn.disabled = false;
    errorMsg.textContent = "Failed to submit review. Please try again.";
    errorMsg.style.display = 'block';
  }
});

// ====== Event Listeners ======
addReviewBtn.addEventListener('click', toggleForm);

// ====== Initialize ======
window.addEventListener('DOMContentLoaded', () => {
  populateSelectOptions();
  fetchReviews();
});
