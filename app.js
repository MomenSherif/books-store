import Book, { addBook, deleteBook, getBooks, getBook, updateBook } from './books.js';
import Author from './author.js';
import * as validation from './validation.js';

const booksNumberForm = document.querySelector('.books-number-form');
const booksNumber = booksNumberForm.booksNumber;
let numberOfBooks;

const bookDetailsForm = document.querySelector('.book-details-form');

const booksTable = document.querySelector('.table');

booksNumberForm.addEventListener('submit', e => {
  e.preventDefault();
  numberOfBooks = parseInt(booksNumber.value);
  booksNumberForm.parentNode.classList.add('d-none');
  booksNumberForm.parentNode.classList.remove('d-flex');
  bookDetailsForm.closest('.container').classList.remove('d-none');

});


bookDetailsForm.addEventListener('submit', e => {
  e.preventDefault();

  if (getBooks().length < numberOfBooks) {
    const bookName = bookDetailsForm.bookName.value.trim();
    const bookPrice = bookDetailsForm.bookPrice.value.trim();
    const publishDate = bookDetailsForm.publishDate.value;
    const authorName = bookDetailsForm.authorName.value;
    const authorEmail = bookDetailsForm.authorEmail.value;

    const author = new Author(authorName, authorEmail);
    const book = new Book(bookName, bookPrice, publishDate, author);

    addBook(book);
    console.log(getBooks());
    bookDetailsForm.reset();
    bookDetailsForm.bookNumber.value = getBooks().length + 1;
  }


  if (getBooks().length === numberOfBooks) {
    bookDetailsForm.closest('.container').classList.add('d-none');
    booksTable.parentNode.classList.remove('d-none');
    booksTable.querySelector('tbody').innerHTML = generateBooksHTML(getBooks());
  }

});

bookDetailsForm.addEventListener('reset', e => {
  e.preventDefault();
  bookDetailsForm.querySelectorAll('input[required]').forEach(input => input.value = '');
});


let editable = false;
let editableRow = null;
let editing = true;

booksTable.addEventListener('click', e => {
  const el = e.target;
  const book = el.closest('tr');

  if (el.matches('.btn-delete')) {
    deleteBook(book.dataset.book);
    book.parentNode.removeChild(book);
  } else if (el.matches('.btn-edit') && !editable) {
    editable = true;
    editableRow = el.closest('tr').dataset.book;
    el.closest('.btns').innerHTML = swapBtns();

  } else if (el.matches('.btn-cancel')) {
    restoreBookData(getBook(editableRow), el.closest('tr'));
    finishedEditing(el.closest('.btns'));
  } else if (el.matches('.btn-save')) {
    const bookName = book.querySelector('[data-target="name"]').textContent;
    const bookPrice = book.querySelector('[data-target="price"]').textContent;
    const publishDate = book.querySelector('[data-target="publishDate"]').textContent;
    const authorName = book.querySelector('[data-target="author-name"]').textContent;
    const authorEmail = book.querySelector('[data-target="author-email"]').textContent;
    const newAuthor = new Author(authorName, authorEmail);
    const newBook = new Book(bookName, bookPrice, publishDate, newAuthor);
    updateBook(book.dataset.book, newBook);
    book.dataset.book = bookName;
    finishedEditing(el.closest('.btns'));
  }
});

booksTable.addEventListener('dblclick', e => {
  console.log(getBooks());
  const el = e.target;
  const currentRow = el.closest('tr').dataset.book;
  if (!(editable
    && editableRow === currentRow
    && el.matches('td[data-target]'))
  ) return;

  if (editing) {

    const cellValue = el.textContent;
    // const cellTarget = el.dataset.target;
    const cellValidation = el.dataset.validation;
    const saveBtn = el.parentNode.querySelector('.btn-save');

    const input = `<input type="text" class="form-control cell__input">`;
    el.insertAdjacentHTML('beforeend', input);
    const cellInputElement = el.querySelector('.cell__input');
    cellInputElement.value = cellValue;
    cellInputElement.focus();

    cellInputElement.addEventListener('blur', e => {
      const value = cellInputElement.value.trim();
      /* validation input */
      const isValid = validation[cellValidation];
      if (!isValid(cellInputElement.value)) {
        cellInputElement.focus();
        return;
      }
      el.textContent = value;
      editing = true;
    });

    cellInputElement.addEventListener('keyup', e => {
      const isValid = validation[cellValidation];
      if (isValid(cellInputElement.value)) {
        cellInputElement.classList.add('is-valid');
        saveBtn.removeAttribute('disabled');
        cellInputElement.classList.remove('is-invalid');
      } else {
        cellInputElement.classList.add('is-invalid');
        saveBtn.setAttribute('disabled', true);
        cellInputElement.classList.remove('is-valid');
      }
    });

    editing = false;
  }


});



function finishedEditing(btns) {
  editable = false;
  editableRow = null;
  editing = true;
  btns.innerHTML = swapBtns();
}

function generateBooksHTML(books) {
  return books.map((book, i) => {
    return `
        <tr data-book="${book.name}">
          <td>${i + 1}</td>
          <td data-target="name" data-validation="isValidName">${book.name}</td>
          <td data-target="price" data-validation="isValidPrice">${book.price}</td>
          <td data-target="publishDate" data-validation="isValidDate">${book.publishDate}</td>
          <td data-target="author-name" data-validation="isValidName">${book.author.name}</td>
          <td data-target="author-email" data-validation="isValidEmail">${book.author.email}</td>
          <td class="btns">
            <button class="btn  btn-info btn-edit">Edit</button>
            <button class="btn  btn-danger btn-delete">Delete</button>
          </td>
        </tr>`
  }).join('');
}

function restoreBookData(book, tr) {
  tr.querySelector('[data-target="name"]').textContent = book.name;
  tr.querySelector('[data-target="price"]').textContent = book.price;
  tr.querySelector('[data-target="publishDate"]').textContent = book.publishDate;
  tr.querySelector('[data-target="author-name"]').textContent = book.author.name;
  tr.querySelector('[data-target="author-email"]').textContent = book.author.email;
}

function swapBtns() {
  if (editable) {
    return `
    <button class="btn  btn-success btn-save">Save</button>
    <button class="btn  btn-warning btn-cancel">Cancel</button>`;
  } else {
    return `
    <button class="btn  btn-info btn-edit">Edit</button>
    <button class="btn  btn-danger btn-delete">Delete</button>`;
  }
}
