const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = readPage === pageCount;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (!name) {
    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      })
      response.code(400);
      return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      })
      response.code(400);
      return response;
  }

  books.push({
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  });

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      })
      response.code(201);
      return response;
  }

  const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    })
    response.code(500);
    return response;
};

const getAllBooksHandler = (request,h) => {
  const { 
    finished,
    reading,
    } = request.query;

  let allBooks = books;
  
  if (finished === '1' || finished === '0') {
    allBooks = books
      .filter((book) => book.finished === !!parseInt(finished, 10))
      .map((b) => ({
        id: b.id,
        name: b.name,
        publisher: b.publisher,
      }));
  }

  if (reading === '1' || reading === '0') {
    allBooks = books
      .filter((book) => book.reading === !!parseInt(reading, 10))
      .map((b) => ({
        id: b.id,
        name: b.name,
        publisher: b.publisher,
      }));
  }

  const response = h.response({
    status: 'success',
    data: {
        books: allBooks.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        })),
    },
});

  response.code(200);
  return response;

};

const getDetailBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((b) => b.id === bookId)[0];

  if (book) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    })
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const index = books.findIndex((b) => b.id === bookId);

  if (!name) {
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      response.code(400);
      return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      response.code(400);
      return response;
  }

  if (index === -1) {
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      })
      response.code(404);
      return response;
  }

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((b) => b.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
    response.code(404);
    return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getDetailBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
