function getWishlistBooksFromLocalStorage() {
  const bookWishList = localStorage.getItem(wishListEntryName);
  if (bookWishList === null) {
    return [];
  } else {
    return JSON.parse(bookWishList);
  }
}

(function init() {
  const bookWishList = getWishlistBooksFromLocalStorage();
  const wishListCardsElement = document.getElementById("wishlist-cards");

  bookWishList?.forEach((eachWishedBook) => {
    wishListCardsElement?.append(cardGenerator(eachWishedBook));
  });
})();
