function cardGenerator() {
  const cardWrapper = document.createElement("div");
  cardWrapper.classList.add("book-card");

  /**
   * Card Image
   */
  const cardImageDiv = document.createElement("div");
  cardImageDiv.classList.add("card-image");

  const cardImage = document.createElement("img");
  cardImage.src = "./public/cover.jpg";
  cardImage.alt = "Book";
  cardImageDiv.appendChild(cardImage);

  /**
   * Card Header
   */
  const cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header");
  const cardSubHeader = document.createElement("p");
  cardSubHeader.classList.add("card-sub-header");
  cardSubHeader.innerHTML = "#16";
  cardHeader.appendChild(cardSubHeader);
  const cardMainHeader = document.createElement("h2");
  cardMainHeader.classList.add("card-main-header");
  cardMainHeader.innerHTML = "Book Name";
  cardHeader.appendChild(cardMainHeader);

  /**
   * Card Body
   */
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  const cardDataLeft = document.createElement("p");
  cardDataLeft.classList.add("card-data-left");
  cardDataLeft.innerHTML = "Author Name";
  cardBody.appendChild(cardDataLeft);
  const cardDataRight = document.createElement("p");
  cardDataRight.classList.add("card-data-right");
  cardDataRight.innerHTML = "in ";
  const cardDataSpan = document.createElement("span");
  cardDataSpan.innerHTML = "Genre";
  cardDataRight.appendChild(cardDataSpan);
  cardBody.appendChild(cardDataRight);

  cardWrapper.appendChild(cardImageDiv);
  cardWrapper.appendChild(cardHeader);
  cardWrapper.appendChild(cardBody);

  return cardWrapper;
}

async function fetchBooks() {
  // const response = await fetch("https://gutendex.com/books");
  // console.log("🚀 ~ fetchBooks ~ response:", response);
}

(function init() {
  const bookCard = cardGenerator();
  const bookCardsElement = document.getElementById("book-cards");
  bookCardsElement.appendChild(bookCard);
  fetchBooks();
})();
