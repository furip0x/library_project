const openPopupButton = document.querySelector('#open-popup');
const bookPopup = document.querySelector('#book-popup');
const addBookBtn = document.querySelector('#add-book-btn');
const bookPopupBg = document.querySelector('.book__bg');
const bookPopupCloseBtn = document.querySelector('.book__form__close');
const booksList = document.querySelector('#books-list');
const allRemoveBtn = document.querySelectorAll("#remove-book");

openPopupButton.addEventListener('click', () => bookPopup.classList.add('book-popup--visible'));

[bookPopupBg, bookPopupCloseBtn].forEach(item => {
  item.addEventListener('click', event => {
    bookPopup.classList.remove('book-popup--visible')
  });
});

// let myLibrary = [];
// let newBook;
if(!localStorage.getItem("isInitialize")) {
  localStorage.setItem("libraryArray", '[]');
  addBookToLibrary("The Priory of the Orange Tree", "Samantha Shannon", 848, true);
  addBookToLibrary("The Devil and the Dark Water", "Stuart Turton", 463, false);
  addBookToLibrary("Circe", "Madeline Miller", 393, false);
  addBookToLibrary("The Great Alone", "Kristin Hannah ", 435, false);
  localStorage.setItem("isInitialize", true);
} else {
  const library = JSON.parse(localStorage.getItem('libraryArray'));
  let index = 0;
  for (let book of library) {
    console.log("index: ",index)
    showBook(index)
    index++;
  }
}

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

function addBookToLibrary(title, author, pages, read, index) {
  const library = JSON.parse(localStorage.getItem("libraryArray"));
  const newBook = new Book(title, author, pages, read);
  library.push(newBook);
  localStorage.setItem("libraryArray", JSON.stringify(library));
  index = library.length === 0 ? 0 : library.length - 1;
  showBook(index);
}

function showBook(bookIndex) {
  const library = JSON.parse(localStorage.getItem("libraryArray"));
  const book = library[bookIndex];
  const bookItem = document.createElement('div');
  bookItem.setAttribute("id", bookIndex);
  let readText, readClass = "";
  if(book.read) {
    readText = "Read";
    readClass = "button--green";
  } else {
    readText = "Not Read";
    readClass = "button--light-red"
  }
  bookItem.classList.add('books-list__item');
  bookItem.innerHTML = `
          <div class="books-list__body">
            <h2 class="books-list__title">${book.title}</h2>
            <div class="books-list__author">${book.author}</div>
            <div class="books-list__page">${book.pages}</div>
          </div>
          <div class="books-list__buttons">
            <button type="button" class="read-book books-list__button ${readClass}">${readText}</button>
            <button type="button" class="remove-book books-list__button button--red">Remove</button>
          </div>
          `;
  booksList.appendChild(bookItem);
}

addBookBtn.addEventListener('click', () => {
  bookPopup.classList.remove('book-popup--visible');
  const bookFormTitle = document.getElementById('title');
  const bookFormAuthor = document.getElementById('author');
  const bookFormPages = document.getElementById('pages');
  const bookFormRead = document.getElementById('read');

  const bookFormTitleVal = bookFormTitle.value;
  const bookFormAuthorVal = bookFormAuthor.value;
  const bookFormPagesVal = bookFormPages.value;
  const bookFormReadVal = bookFormRead.checked;

  addBookToLibrary(bookFormTitleVal, bookFormAuthorVal, bookFormPagesVal, bookFormReadVal);

  bookFormTitle.value = '';
  bookFormAuthor.value = '';
  bookFormPages.value = '';
  bookFormRead.checked = '';
});

function getBook(bookTitle) {
  const library = JSON.parse(localStorage.getItem("libraryArray"));
  for (let book of library) {
    if (book.title === bookTitle) {
      return book;
    }
  }
  return null;
}

function removeFromLibrary(booksTitle) {
  const library = JSON.parse(localStorage.getItem("libraryArray"));
  const newLibrary = library.filter((books) => books.title !== booksTitle);
  localStorage.setItem("libraryArray", JSON.stringify(newLibrary));
}

function getBookFromInput() {
  const title = document.querySelector('title').value;
  const author = document.querySelector('#author').value;
  const pages = document.querySelector('#pages').value;
  const read = document.querySelector('#read').checked;
  return new Book(title, author, pages, read);
}

booksList.addEventListener('click', checkBooksInput);

function checkBooksInput(e) {
  if (e.target.classList.contains('remove-book')) {
    removeFromLibrary(e.target.parentElement.previousElementSibling.firstElementChild.textContent);
    booksList.removeChild(e.target.parentNode.parentNode);
  } else if (e.target.classList.contains('read-book')) {
    if (e.target.textContent === 'Read') {
      const book = getBook(e.target.parentElement.previousElementSibling.firstElementChild.textContent);
      book.read = false;
      e.target.innerHTML = 'Not read';
      e.target.classList.remove('button--green');
      e.target.classList.add('button--light-red');
      setBoook(e.target.parentElement.parentElement.getAttribute('id'), book);
    } else {
      const book = getBook(e.target.parentElement.previousElementSibling.firstElementChild.textContent);
      book.read = true;
      e.target.innerHTML = 'Read';
      e.target.classList.remove('button--light-red');
      e.target.classList.add('button--green');
      setBoook(e.target.parentElement.parentElement.getAttribute('id'), book);
    }
  }
}

function setBoook(index, bookObj) {
  const library = JSON.parse(localStorage.getItem("libraryArray"));
  library[index] = bookObj;
  localStorage.setItem("libraryArray", JSON.stringify(library));
}