// - A <ul class="review-list"></ul> for displaying reviewsdocument.addEventListener('DOMContentLoaded', () => {
  const reviewList = document.querySelector('.review-list');
  const reviewForm = document.getElementById('review-form');
  const authorInput = reviewForm.querySelector('input[name="author"]');
  const contentInput = reviewForm.querySelector('textarea[name="review"]');

  // Initialize reviews array (could be extended to fetch from backend)
  let reviews = [];

  // Load reviews from localStorage if present
  if (localStorage.getItem('resilienceoneReviews')) {
    reviews = JSON.parse(localStorage.getItem('resilienceoneReviews'));
    renderReviews();
  }

  // Form submission handler
  reviewForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const author = authorInput.value.trim() || "Anonymous";
    const content = contentInput.value.trim();

    if (!content) {
      alert('Please enter your review.');
      return;
    }

    const review = {
      author,
      content,
      date: new Date().toLocaleDateString()
    };

    reviews.unshift(review); // Add new review to top
    localStorage.setItem('resilienceoneReviews', JSON.stringify(reviews));

    renderReviews();

    // Reset form
    reviewForm.reset();
  });

  // Render all reviews
  function renderReviews() {
    reviewList.innerHTML = '';
    if (reviews.length === 0) {
      reviewList.innerHTML = '<li style="text-align:center;color:#888;">No reviews yet. Be the first!</li>';
      return;
    }
    reviews.forEach(review => {
      const li = document.createElement('li');
      li.className = 'review-item';
      li.innerHTML = `
        <span class="review-author">${escapeHTML(review.author)}</span>
        <span class="review-date">${review.date}</span>
        <div class="review-content">${escapeHTML(review.content)}</div>
      `;
      reviewList.appendChild(li);
    });
  }

  // Utility to escape HTML (basic)
  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, function (m) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[m];
    });
  }
});
