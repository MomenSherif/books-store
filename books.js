class Book {
  constructor(name, price, publishDate, author) {
    this.name = name;
    this.price = price;
    this.publishDate = publishDate;
    this.author = author;
  }
}

const books = [];

function addBook(book) {
  books.push(book);
}

function deleteBook(name) {
  const bookIndex = books.findIndex(book => book.name === name);
  books.splice(bookIndex, 1);
}
function updateBook(bookName, newBook) {
  const { name, price, publishDate, author } = newBook;
  const book = getBook(bookName);
  book.name = name;
  book.price = price;
  book.publishDate = publishDate;
  book.author = author;
}

function getBooks() {
  return books;
}

function getBook(name) {
  return books.find(book => book.name === name);
}

export { Book as default, addBook, deleteBook, getBooks, getBook, updateBook };