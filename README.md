# ResilienceOne App Reviews Dashboard

This project is a dynamic, responsive HTML dashboard that visualizes and displays user reviews for the **ResilienceOne App**. It combines a live scrolling feed of generated user reviews with an interactive infographic summarizing review statistics.

## 🌟 Features

- **Live Review Feed**  
  Displays a continuously scrolling list of mock user reviews with names, emails, ratings, comments, and dates.

- **Review Summary Dashboard**  
  Interactive bar chart visualizing the distribution of star ratings (1 to 5 stars) using Chart.js.

- **Responsive UI**  
  Styled using clean, mobile-friendly CSS for an intuitive user experience.

## 🧰 Technologies Used

- HTML5 & CSS3  
- JavaScript (Vanilla)
- [Chart.js](https://www.chartjs.org/) for infographic visualization

## 📂 Project Structure

index.html         # Main file with embedded styles and scripts
README.md          # This documentation

## 🚀 How to Use

1. **Open the `index.html` file** in your browser.
2. The review dashboard will load automatically with 100 randomly generated sample reviews.
3. The bar chart at the top summarizes the number of reviews by rating.

## 📊 Customization Tips

- **To use real data**, replace the JavaScript `sampleComments` array and the `generateReview()` function with data pulled from a backend or an actual CSV/JSON file.
- **Adjust the scroll speed** by modifying the animation duration in the CSS `@keyframes scrollUp`.


## 📃 License

This project is open for educational and demonstration purposes.
