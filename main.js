function cardGenerator({ imageUrl, id, bookName, authorNames, genre }) {
  const cardWrapper = document.createElement("div");
  cardWrapper.classList.add("book-card");

  /**
   * Card Image
   */
  const cardImageDiv = document.createElement("div");
  cardImageDiv.classList.add("card-image");

  const cardImage = document.createElement("img");
  // cardImage.src = "./public/cover.jpg";
  cardImage.src = imageUrl;
  // cardImage.alt = "Book";
  cardImage.alt = bookName;
  cardImageDiv.appendChild(cardImage);

  /**
   * Card Header
   */
  const cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header");
  const cardSubHeader = document.createElement("p");
  cardSubHeader.classList.add("card-sub-header");
  // cardSubHeader.innerHTML = "#16";
  cardSubHeader.innerHTML = `#${id}`;
  cardHeader.appendChild(cardSubHeader);
  const cardMainHeader = document.createElement("h2");
  cardMainHeader.classList.add("card-main-header");
  if (bookName?.length > 20) {
    cardMainHeader.innerHTML = bookName?.substring(0, 40) + "...";
    cardMainHeader.title = bookName;
  } else {
    cardMainHeader.innerHTML = bookName;
  }
  cardHeader.appendChild(cardMainHeader);

  /**
   * Card Body
   */
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  const cardDataLeft = document.createElement("p");
  cardDataLeft.classList.add("card-data-left");
  // cardDataLeft.innerHTML = "Author Name";
  cardDataLeft.innerHTML = authorNames;
  cardBody.appendChild(cardDataLeft);
  const cardDataRight = document.createElement("p");
  cardDataRight.classList.add("card-data-right");
  cardDataRight.innerHTML = "in ";
  const cardDataSpan = document.createElement("span");
  // cardDataSpan.innerHTML = "Genre";
  cardDataSpan.innerHTML = genre;
  cardDataRight.appendChild(cardDataSpan);
  cardBody.appendChild(cardDataRight);

  cardWrapper.appendChild(cardImageDiv);
  cardWrapper.appendChild(cardHeader);
  cardWrapper.appendChild(cardBody);

  return cardWrapper;
}

async function fetchBooks() {
  // const response = await fetch("https://gutendex.com/books");
  const response = await fetch("./sample.json");
  const data = await response.json();
  // console.log("🚀 ~ fetchBooks ~ data:", data);
  const { results } = data ?? {};
  console.log("🚀 ~ fetchBooks ~ results:", results);

  const bookCardsElement = document.getElementById("book-cards");
  if (Array.isArray(results)) {
    results.forEach((eachBook) => {
      const cardGeneratorProps = {
        imageUrl: eachBook?.formats?.["image/jpeg"],
        id: eachBook?.id,
        bookName: eachBook?.title,
        authorNames: eachBook?.authors?.[0]?.name,
        genre: eachBook?.subjects?.[0],
      };
      bookCardsElement.appendChild(cardGenerator(cardGeneratorProps));
    });
  }
}

(function init() {
  fetchBooks();
})();
