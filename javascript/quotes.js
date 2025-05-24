const quotes = [
  "I like turtles. - Kieran",
];


// Function to pick a random quote
function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

// Check if the quote for today has been already displayed
function displayQuote() {
  const today = new Date().toDateString();
  const storedDate = localStorage.getItem('quoteDate');
  
  if (storedDate !== today) {
    const randomQuote = getRandomQuote();
    document.getElementById('quote').textContent = randomQuote;
    localStorage.setItem('quoteDate', today); // Store today's date in localStorage
    localStorage.setItem('quote', randomQuote); // Store today's quote
  } else {
    // If it's the same day, display the same quote as stored in localStorage
    let quoteoftheday = localStorage.getItem('quote');
    document.getElementById('quote').textContent = quoteoftheday + ' - 2025';
  }
}

// Call the function to display the quote
displayQuote();
