function deleteDomElement(element) {
  element.parentNode.removeChild(element);
}

/**
 * Responds with boolean. true=present, and false=not present
 * @param {Number} id
 * @returns {Boolean}
 */
function checkIfBookIdIsInLocalStorage(id) {
  const entryName = "book_id_wishlist";
  const bookIdList = localStorage.getItem(entryName);
  if (bookIdList === null) {
    return false;
  } else {
    const tempArray = JSON.parse(bookIdList);
    if (tempArray?.includes(id)) {
      return true;
    } else {
      return false;
    }
  }
}

/**
 * Responds with boolean. true=success, and false=failure
 * @param {Number} id
 * @returns {Boolean}
 */
function addBookIdToLocalStorage(id) {
  const entryName = "book_id_wishlist";
  const bookIdList = localStorage.getItem(entryName);
  if (bookIdList === null) {
    localStorage.setItem(entryName, JSON.stringify([id]));
    return true;
  } else {
    const tempArray = JSON.parse(bookIdList);
    if (!tempArray?.includes(id)) {
      tempArray?.push(id);
      localStorage.setItem(entryName, JSON.stringify(tempArray));
      return true;
    } else {
      return false;
    }
  }
}

function removeBookIdFromLocalStorage(id) {
  const entryName = "book_id_wishlist";
  const bookIdList = localStorage.getItem(entryName);
  if (bookIdList === null) {
    return;
  } else {
    const tempArray = JSON.parse(bookIdList);
    localStorage.setItem(
      entryName,
      JSON.stringify(tempArray?.filter((eachId) => eachId !== id))
    );
  }
}

function cardGenerator({ imageUrl, id, bookName, authorNames, genreList }) {
  const cardWrapper = document.createElement("div");
  cardWrapper.classList.add("book-card");

  /**
   * Card Image
   */
  const cardImageDiv = document.createElement("div");
  cardImageDiv.classList.add("card-image");

  const cardImage = document.createElement("img");
  cardImage.src = imageUrl;
  cardImage.alt = bookName;
  cardImageDiv.append(cardImage);

  /**
   * Card Header
   */
  const cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header");

  const cardSubHeader = document.createElement("div");
  cardSubHeader.classList.add("card-sub-header");
  // cardImageDiv.id = `imageDiv_${id}`;
  const cardSubHeaderLeft = document.createElement("span");
  cardSubHeaderLeft.innerHTML = `#${id}`;
  cardSubHeader.append(cardSubHeaderLeft);
  const cardSubHeaderRight = document.createElement("div");
  const cardWishImageElement = document.createElement("img");
  if (checkIfBookIdIsInLocalStorage(id)) {
    cardWishImageElement.src = "./public/heart-solid-purple.svg";
  } else {
    cardWishImageElement.src = "./public/heart-solid-gray.svg";
  }
  cardWishImageElement.onclick = () => {
    const result = addBookIdToLocalStorage(id);
    if (result) {
      cardWishImageElement.src = "./public/heart-solid-purple.svg";
    } else {
      console.log("Remove!");
      removeBookIdFromLocalStorage(id);
      cardWishImageElement.src = "./public/heart-solid-gray.svg";
    }
  };
  cardSubHeaderRight.append(cardWishImageElement);
  cardSubHeader.append(cardSubHeaderRight);
  cardHeader.append(cardSubHeader);

  const cardMainHeader = document.createElement("h2");
  cardMainHeader.classList.add("card-main-header");
  if (bookName?.length > 40) {
    cardMainHeader.innerHTML = bookName?.substring(0, 40) + "...";
    cardMainHeader.title = bookName;
  } else {
    cardMainHeader.innerHTML = bookName;
  }
  cardHeader.append(cardMainHeader);

  /**
   * Card Body
   */
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const authorNameElement = document.createElement("p");
  authorNameElement.classList.add("author-name");
  const authorNamesArray = authorNames
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
  if (genreList?.length > 1) {
    const remainingGenreCount = genreList?.length - 1;
    cardDataSpan.innerHTML = `${
      genreList?.[0]
    } and ${remainingGenreCount} other${remainingGenreCount > 1 ? "s" : ""}`;
  } else {
    cardDataSpan.innerHTML = genreList?.[0];
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

  const existingNextButton = document.getElementById("pagination-button-next");

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

async function fetchBooks({ url }) {
  const response = await fetch(url);
  const data = await response.json();
  console.log("🚀 ~ fetchBooks ~ data:", data);

  paginationGenerator(data);

  const { results } = data ?? {};
  // console.log("🚀 ~ fetchBooks ~ results:", results);

  const bookCardsElement = document.getElementById("book-cards");
  bookCardsElement.innerHTML = ""; // clears everything
  if (Array.isArray(results)) {
    results.forEach((eachBook) => {
      const cardGeneratorProps = {
        imageUrl: eachBook?.formats?.["image/jpeg"],
        id: eachBook?.id,
        bookName: eachBook?.title,
        authorNames: eachBook?.authors?.[0]?.name,
        genreList: eachBook?.subjects,
      };
      bookCardsElement.append(cardGenerator(cardGeneratorProps));
    });
  }
}

(function init() {
  fetchBooks({
    // url: "https://gutendex.com/books",
    url: "./sample.json",
  });
})();
