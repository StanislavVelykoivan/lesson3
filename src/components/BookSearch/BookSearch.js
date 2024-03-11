import React, { useState, useEffect } from 'react';

function BookSearch() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (query === '') {
      setBooks(bookmarks);
    }
  }, [query, bookmarks]);

  const searchBooks = async () => {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
      const data = await response.json();
      setBooks(data.items);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const searchBooksByAuthor = async (author) => {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=inauthor:${author}`);
      const data = await response.json();
      setBooks(data.items);
      setSelectedAuthor(author);
    } catch (error) {
      console.error('Error fetching books by author:', error);
    }
  };

  const sortByDate = (direction) => {
    const sortedBooks = [...books].sort((a, b) => {
      if (direction === 'asc') {
        return new Date(a.volumeInfo.publishedDate) - new Date(b.volumeInfo.publishedDate);
      } else {
        return new Date(b.volumeInfo.publishedDate) - new Date(a.volumeInfo.publishedDate);
      }
    });
    setBooks(sortedBooks);
  };

  const sortByName = (direction) => {
    const sortedBooks = [...books].sort((a, b) => {
      if (direction === 'asc') {
        return a.volumeInfo.title.localeCompare(b.volumeInfo.title);
      } else {
        return b.volumeInfo.title.localeCompare(a.volumeInfo.title);
      }
    });
    setBooks(sortedBooks);
  };

  const toggleBookmark = (bookId) => {
    const index = bookmarks.findIndex((book) => book.id === bookId);
    if (index === -1) {
      const bookToAdd = books.find((book) => book.id === bookId);
      setBookmarks([...bookmarks, bookToAdd]);
    } else {
      const updatedBookmarks = [...bookmarks];
      updatedBookmarks.splice(index, 1);
      setBookmarks(updatedBookmarks);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for books"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchBooks}>Search</button>

      <div>
        <button onClick={() => sortByDate('asc')}>Sort by Date (Asc)</button>
        <button onClick={() => sortByDate('desc')}>Sort by Date (Desc)</button>
        <button onClick={() => sortByName('asc')}>Sort by Name (Asc)</button>
        <button onClick={() => sortByName('desc')}>Sort by Name (Desc)</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {selectedAuthor && (
          <div>
            <h2>Books by {selectedAuthor}</h2>
            <button onClick={() => setSelectedAuthor(null)}>Back to all books</button>
          </div>
        )}

        {books.map((book) => (
          <div key={book.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
            <h3>{book.volumeInfo.title}</h3>
            <p>Authors: {book.volumeInfo.authors.join(', ')}</p>
            <p>Published Date: {book.volumeInfo.publishedDate}</p>
            <input
              type="checkbox"
              checked={bookmarks.some((bookmark) => bookmark.id === book.id)}
              onChange={() => toggleBookmark(book.id)}
            />
            <label>Add to bookmarks</label>
            {selectedAuthor === null && (
              <button onClick={() => searchBooksByAuthor(book.volumeInfo.authors[0])}>Books by {book.volumeInfo.authors[0]}</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookSearch;
