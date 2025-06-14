// Dummy reviews for demonstration; replace with your actual data or data source.
const reviews = [
  {
    author: "Jane Doe",
    reviewBody: "This app changed my life!",
    rating: 5
  },
  {
    author: "John Smith",
    reviewBody: "Very insightful and empowering.",
    rating: 4
  }
  // More reviews...
];

// Utility to render reviews using schema.org markup
function renderReviews(reviews) {
  const reviewList = document.getElementById('reviewList');
  if (!reviewList) return;

  // Remove loading indicator if present
  const loadingIndicator = document.getElementById('loadingIndicator');
  if (loadingIndicator) loadingIndicator.style.display = 'none';

  // Clear existing reviews
  reviewList.innerHTML = '';

  reviews.forEach(review => {
    const div = document.createElement('div');
    div.setAttribute('itemscope', '');
    div.setAttribute('itemtype', 'http://schema.org/Review');
    div.className = 'review-item';

    // Author
    const authorSpan = document.createElement('span');
    authorSpan.setAttribute('itemprop', 'author');
    authorSpan.textContent = review.author;
    div.appendChild(authorSpan);

    div.appendChild(document.createTextNode(' — '));

    // Review body
    const bodySpan = document.createElement('span');
    bodySpan.setAttribute('itemprop', 'reviewBody');
    bodySpan.textContent = review.reviewBody;
    div.appendChild(bodySpan);

    div.appendChild(document.createElement('br'));

    // Rating (schema.org)
    const ratingSpan = document.createElement('span');
    ratingSpan.setAttribute('itemprop', 'reviewRating');
    ratingSpan.setAttribute('itemscope', '');
    ratingSpan.setAttribute('itemtype', 'http://schema.org/Rating');

    const worstMeta = document.createElement('meta');
    worstMeta.setAttribute('itemprop', 'worstRating');
    worstMeta.setAttribute('content', '1');
    ratingSpan.appendChild(worstMeta);

    const ratingValueSpan = document.createElement('span');
    ratingValueSpan.setAttribute('itemprop', 'ratingValue');
    ratingValueSpan.textContent = review.rating;
    ratingSpan.appendChild(ratingValueSpan);

    ratingSpan.appendChild(document.createTextNode(' / '));

    const bestRatingSpan = document.createElement('span');
    bestRatingSpan.setAttribute('itemprop', 'bestRating');
    bestRatingSpan.textContent = '5';
    ratingSpan.appendChild(bestRatingSpan);

    div.appendChild(ratingSpan);

    reviewList.appendChild(div);
  });

  if (reviews.length === 0) {
    const empty = document.createElement('div');
    empty.textContent = "No reviews yet. Be the first to submit one!";
    reviewList.appendChild(empty);
  }
}

// Setup form behavior for UX and accessibility
document.addEventListener('DOMContentLoaded', function () {
  // Render initial reviews
  renderReviews(reviews);

  // Populate rating select
  const ratingSelect = document.getElementById('rating');
  if (ratingSelect) {
    ratingSelect.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i;
      ratingSelect.appendChild(opt);
    }
  }

  // Populate country select (simple example; replace with real country list)
  const countrySelect = document.getElementById('country');
  if (countrySelect) {
    const countries = ['Select Country', 'Singapore', 'Malaysia', 'Indonesia', 'Thailand', 'Vietnam', 'Philippines', 'Other'];
    countrySelect.innerHTML = '';
    countries.forEach(function (name, idx) {
      const opt = document.createElement('option');
      opt.value = idx === 0 ? '' : name;
      opt.textContent = name;
      if (idx === 0) opt.disabled = true;
      countrySelect.appendChild(opt);
    });
  }

  // Show/hide form
  const addReviewBtn = document.getElementById('addReviewBtn');
  const reviewForm = document.getElementById('reviewForm');
  if (addReviewBtn && reviewForm) {
    addReviewBtn.addEventListener('click', function () {
      reviewForm.style.display = reviewForm.style.display === 'none' || !reviewForm.style.display ? 'block' : 'none';
      if (reviewForm.style.display === 'block') {
        reviewForm.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Form submission with button disable and error handling
  if (reviewForm) {
    reviewForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = document.getElementById('submitBtn');
      const successMsg = document.getElementById('successMsg');
      const errorMsg = document.getElementById('errorMsg');
      if (successMsg) successMsg.style.display = 'none';
      if (errorMsg) errorMsg.style.display = 'none';

      // Collect form data
      const author = reviewForm.name.value.trim();
      const email = reviewForm.email.value.trim();
      const country = reviewForm.country.value;
      const rating = parseInt(reviewForm.rating.value, 10);
      const reviewBody = reviewForm.comment.value.trim();

      // Basic validation
      let valid = true;
      // Clear errors
      ['nameError','emailError','countryError','ratingError','commentError'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '';
      });

      // Name validation
      if (!author) {
        document.getElementById('nameError').textContent = "Name is required.";
        valid = false;
      }
      // Email validation (HTML5 pattern)
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        document.getElementById('emailError').textContent = "Valid email is required.";
        valid = false;
      }
      // Country
      if (!country) {
        document.getElementById('countryError').textContent = "Country is required.";
        valid = false;
      }
      // Rating
      if (!rating || rating < 1 || rating > 5) {
        document.getElementById('ratingError').textContent = "Rating must be 1 to 5.";
        valid = false;
      }
      // Comment
      if (!reviewBody) {
        document.getElementById('commentError').textContent = "Review/comment is required.";
        valid = false;
      }

      if (!valid) {
        return;
      }

      // Disable submit button for UX
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      // Simulate async save (replace with your AJAX/fetch/backend logic)
      setTimeout(function () {
        // Add review (in real app, do this after API success)
        reviews.unshift({
          author: author,
          reviewBody: reviewBody,
          rating: rating
        });
        renderReviews(reviews);

        // Reset form and re-enable button
        reviewForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Review';

        if (successMsg) {
          successMsg.textContent = "Thank you! Your review was submitted.";
          successMsg.style.display = 'block';
        }
        reviewForm.style.display = 'none';
      }, 1200);
    });
  }
});
