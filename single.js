const API_BASE_URL = "https://gutendex.com";
const selectedSingleBookIdEntryName = "selected_book_id";

async function fetchSingleBook() {
  const selectedBookId = localStorage.getItem(selectedSingleBookIdEntryName);

  if (selectedBookId !== null) {
    const response = await fetch(`${API_BASE_URL}/books/${selectedBookId}/`);
    const result = await response.json();

    // Setting image
    const imageParentElement = document.getElementById("single-book-image");
    const bookImageLink = result?.formats?.["image/jpeg"];
    const newImageElement = document.createElement("img");
    newImageElement.src = bookImageLink;
    newImageElement.alt = result?.title;
    imageParentElement.append(newImageElement);

    // Setting the other data

    const idElement = document.getElementById("single-book-id");
    idElement.innerHTML = `#${result?.id}`;

    const titleElement = document.getElementById("single-book-title");
    titleElement.innerHTML = result?.title;

    const authorElement = document.getElementById("single-book-author");
    result?.authors?.forEach((eachAuthor) => {
      const newDivElement = document.createElement("div");
      newDivElement.append(eachAuthor?.name);
      const newSpanElement = document.createElement("span");
      newSpanElement.innerHTML = `[${eachAuthor?.birth_year} - ${eachAuthor?.death_year}]`;
      newDivElement.append(newSpanElement);
      authorElement.append(newDivElement);
    });

    const genresWrapperElement = document.getElementById(
      "single-book-genres-all"
    );
    result?.subjects?.forEach((eachSubject) => {
      const newParagraphElement = document.createElement("p");
      newParagraphElement.innerHTML = eachSubject;
      genresWrapperElement.append(newParagraphElement);
    });

    const bookshelvesWrapperElement = document.getElementById(
      "single-book-bookshelves-all"
    );
    result?.bookshelves?.forEach((eachShelf) => {
      const newParagraphElement = document.createElement("p");
      newParagraphElement.innerHTML = eachShelf;
      bookshelvesWrapperElement.append(newParagraphElement);
    });

    const readThisBookLinkElement = document.getElementById(
      "single-book-read-link"
    );
    readThisBookLinkElement.href = result?.formats?.["text/html"];
  }
}

(function init() {
  fetchSingleBook();
})();
