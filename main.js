/**
 * Constants
 */
const API_BASE_URL = "https://gutendex.com";
const wishListEntryName = "book_wishlist";
const selectedSingleBookIdEntryName = "selected_book_id";

/**
 * Utils
 */
function deleteDomElement(element) {
  element.parentNode.removeChild(element);
}
const debounce = (fn, delay = 500) => {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
};

// Search and Filters
const handleSearchInputChange = debounce(() => {
  // Resetting the other filter
  const genreDropdownElement = document.getElementById("genre-dropdown");

  const searchInputElement = document.getElementById("title-search");
  const searchInput = searchInputElement.value?.trim();
  if (searchInput) {
    genreDropdownElement.value = "";
    genreDropdownElement.classList.add("input-disabled");

    const searchUrl = `${API_BASE_URL}/books/?search=${searchInput}`;
    fetchBooks({
      url: searchUrl,
      onAfterFetch: () => {
        genreDropdownElement.classList.remove("input-disabled");
      },
    });
  }
});
function handleGenreDropdownChange() {
  // Resetting the other filter
  const searchInputElement = document.getElementById("title-search");

  const genreDropdownElement = document.getElementById("genre-dropdown");
  const selectedGenre = genreDropdownElement.value?.trim();
  if (selectedGenre) {
    searchInputElement.value = "";
    searchInputElement.classList.add("input-disabled");

    const searchUrl = `${API_BASE_URL}/books/?topic=${selectedGenre}`;
    fetchBooks({
      url: searchUrl,
      onAfterFetch: () => {
        searchInputElement.classList.remove("input-disabled");
      },
    });
  }
}

/**
 * Responds with boolean. true=present, and false=not present
 * @param {Number} id
 * @returns {Boolean}
 */
function checkIfBookIdIsInLocalStorage(id) {
  const bookWishList = localStorage.getItem(wishListEntryName);
  if (bookWishList === null) {
    return false;
  } else {
    const tempArray = JSON.parse(bookWishList);
    if (tempArray?.findIndex((eachBook) => eachBook?.id === id) !== -1) {
      return true;
    } else {
      return false;
    }
  }
}
/**
 * Responds with boolean. true=success, and false=failure
 * @returns {Boolean}
 */
function addBookToLocalStorage(book) {
  const bookWishList = localStorage.getItem(wishListEntryName);
  if (bookWishList === null) {
    localStorage.setItem(wishListEntryName, JSON.stringify([book]));
    return true;
  } else {
    const tempArray = JSON.parse(bookWishList);
    if (tempArray?.findIndex((eachBook) => eachBook?.id === book?.id) === -1) {
      tempArray?.push(book);
      localStorage.setItem(wishListEntryName, JSON.stringify(tempArray));
      return true;
    } else {
      return false;
    }
  }
}
function removeBookFromLocalStorage(book) {
  const bookWishList = localStorage.getItem(wishListEntryName);
  if (bookWishList === null) {
    return;
  } else {
    const tempArray = JSON.parse(bookWishList);
    localStorage.setItem(
      wishListEntryName,
      JSON.stringify(tempArray?.filter((eachBook) => eachBook?.id !== book?.id))
    );
  }
}

function cardGenerator(book) {
  const cardInfo = {
    imageUrl: book?.formats?.["image/jpeg"],
    id: book?.id,
    bookName: book?.title,
    authorNames: book?.authors?.[0]?.name,
    genreList: book?.subjects,
  };

  const cardWrapper = document.createElement("div");
  cardWrapper.classList.add("book-card");

  /**
   * Card Image
   */
  const cardImageDiv = document.createElement("div");
  cardImageDiv.classList.add("card-image");
  cardImageDiv.onclick = () => {
    localStorage.setItem(selectedSingleBookIdEntryName, cardInfo?.id);
    window.location.href = "/single";
  };

  const cardImage = document.createElement("img");
  cardImage.src = cardInfo?.imageUrl;
  cardImage.alt = cardInfo?.bookName;
  cardImageDiv.append(cardImage);

  /**
   * Card Header
   */
  const cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header");

  const cardSubHeader = document.createElement("div");
  cardSubHeader.classList.add("card-sub-header");
  const cardSubHeaderLeft = document.createElement("span");
  cardSubHeaderLeft.innerHTML = `#${cardInfo?.id}`;
  cardSubHeader.append(cardSubHeaderLeft);
  const cardSubHeaderRight = document.createElement("div");
  const cardWishImageElement = document.createElement("img");
  cardWishImageElement.alt = "heart icon";
  if (checkIfBookIdIsInLocalStorage(cardInfo?.id)) {
    cardWishImageElement.src = "./public/heart-solid-pink.svg";
  } else {
    cardWishImageElement.src = "./public/heart-solid-gray.svg";
  }
  cardWishImageElement.onclick = () => {
    const result = addBookToLocalStorage(book);
    if (result) {
      cardWishImageElement.src = "./public/heart-solid-pink.svg";
    } else {
      removeBookFromLocalStorage(book);
      cardWishImageElement.src = "./public/heart-solid-gray.svg";
    }
  };
  cardSubHeaderRight.append(cardWishImageElement);
  cardSubHeader.append(cardSubHeaderRight);
  cardHeader.append(cardSubHeader);

  const cardMainHeader = document.createElement("h2");
  cardMainHeader.classList.add("card-main-header");
  cardMainHeader.onclick = () => {
    localStorage.setItem(selectedSingleBookIdEntryName, cardInfo?.id);
    window.location.href = "/single";
  };
  if (cardInfo?.bookName?.length > 40) {
    cardMainHeader.innerHTML = cardInfo?.bookName?.substring(0, 40) + "...";
    cardMainHeader.title = cardInfo?.bookName;
  } else {
    cardMainHeader.innerHTML = cardInfo?.bookName;
  }
  cardHeader.append(cardMainHeader);

  /**
   * Card Body
   */
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const authorNameElement = document.createElement("p");
  authorNameElement.classList.add("author-name");
  const authorNamesArray = cardInfo?.authorNames
    ?.split(",")
    ?.filter((authorName) => authorName); // to filter out possible empty strings
  if (authorNamesArray?.length > 1) {
    const remainingAuthorCount = authorNamesArray?.length - 1;
    authorNameElement.innerHTML = `${
      authorNamesArray?.[0]
    } and ${remainingAuthorCount} other${remainingAuthorCount > 1 ? "s" : ""}`;
  } else {
    authorNameElement.innerHTML = authorNamesArray?.[0];
  }

  cardBody.append(authorNameElement);

  const genreNameElement = document.createElement("p");
  genreNameElement.classList.add("genre-name");
  genreNameElement.innerHTML = "in ";
  const cardDataSpan = document.createElement("span");
  if (cardInfo?.genreList?.length > 1) {
    const remainingGenreCount = cardInfo?.genreList?.length - 1;
    cardDataSpan.innerHTML = `${
      cardInfo?.genreList?.[0]
    } and ${remainingGenreCount} other${remainingGenreCount > 1 ? "s" : ""}`;
  } else {
    cardDataSpan.innerHTML = cardInfo?.genreList?.[0];
  }
  genreNameElement.append(cardDataSpan);
  cardBody.append(genreNameElement);

  cardWrapper.append(cardImageDiv);
  cardWrapper.append(cardHeader);
  cardWrapper.append(cardBody);

  return cardWrapper;
}

function paginationGenerator(data) {
  // const currentNumberOfItems = data?.results?.length;
  // const totalNumberOfPages = Math.ceil(data?.count / currentNumberOfItems);

  const paginationSection = document.getElementById("pagination");

  if (paginationSection !== null) {
    const existingPreviousButton = document.getElementById(
      "pagination-button-previous"
    );

    if (existingPreviousButton === null) {
      const previousButton = document.createElement("button");
      previousButton.classList.add("pagination-button-previous");
      previousButton.id = "pagination-button-previous";
      previousButton.innerHTML = "Previous";

      if (data?.previous !== null) {
        previousButton.onclick = () => {
          fetchBooks({ url: data.previous });
        };
        paginationSection.prepend(previousButton);
      }
    } else {
      if (data?.previous === null) {
        deleteDomElement(existingPreviousButton);
      } else {
        existingPreviousButton.onclick = () => {
          fetchBooks({ url: data.previous });
        };
      }
    }

    const existingNextButton = document.getElementById(
      "pagination-button-next"
    );

    if (existingNextButton === null) {
      const nextButton = document.createElement("button");
      nextButton.classList.add("pagination-button-next");
      nextButton.id = "pagination-button-next";
      nextButton.innerHTML = "Next";

      if (data?.next !== null) {
        nextButton.onclick = () => {
          fetchBooks({ url: data.next });
        };
        paginationSection.append(nextButton);
      }
    } else {
      if (data?.next === null) {
        deleteDomElement(existingNextButton);
      } else {
        existingNextButton.onclick = () => {
          fetchBooks({ url: data.next });
        };
      }
    }
  }
}

async function fetchBooks({ url, onAfterFetch }) {
  const response = await fetch(url);
  const data = await response.json();

  paginationGenerator(data);

  const { results } = data ?? {};

  const genreListForDropdown = [];
  const genreDropdownElement = document.getElementById("genre-dropdown");

  const bookCardsElement = document.getElementById("book-cards");
  bookCardsElement.innerHTML = ""; // clears everything
  if (Array.isArray(results)) {
    results.forEach((eachBook) => {
      // Collecting subjects/genres for the dropdown
      eachBook?.subjects?.forEach((eachGenre) => {
        if (!genreListForDropdown?.includes(eachGenre)) {
          genreListForDropdown.push(eachGenre);
          const dropdownOptionElement = document.createElement("option");
          dropdownOptionElement.value = eachGenre;
          dropdownOptionElement.innerHTML = eachGenre;
          genreDropdownElement.append(dropdownOptionElement);
        }
      });

      bookCardsElement.append(cardGenerator(eachBook));
    });

    const genreDropdownWrapper = document.getElementById(
      "genre-dropdown-wrapper"
    );
    genreDropdownWrapper.classList.remove("hidden");

    if (onAfterFetch) {
      onAfterFetch();
    }
  }
}
