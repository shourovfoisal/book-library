const API_BASE_URL = "https://gutendex.com";
const selectedSingleBookIdEntryName = "selected_book_id";

async function fetchSingleBook() {
  const selectedBookId = localStorage.getItem(selectedSingleBookIdEntryName);

  if (selectedBookId !== null) {
    const response = await fetch(`${API_BASE_URL}/books/${selectedBookId}/`);
    const result = await response.json();
    console.log("🚀 ~ fetchSingleBook ~ result:", result);

    const bookImageLink = result?.formats?.["image/jpeg"];
  }
}

(function init() {
  // fetchSingleBook();
})();
