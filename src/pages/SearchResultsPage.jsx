// src/pages/SearchResultsPage.jsx
import React, { useContext, useState, useEffect } from 'react';
import { SearchContext } from '../context/SearchContext';
import { Link } from 'react-router-dom';
import Pagination from '../components/Testpagenation';

function SearchResultsPage() {
    const { searchResults, performSearch, searchTerm, searchField } = useContext(SearchContext);
    const [currentPage, setCurrentPage] = useState(searchResults.meta.currentPage);
  
    useEffect(() => {
      setCurrentPage(searchResults.meta.currentPage);
    }, [searchResults.meta.currentPage]);
  
    const handlePrevPage = () => {
      if (currentPage > 1) {
        const newPage = currentPage - 1;
        performSearch(searchTerm, searchField, newPage, searchResults.meta.itemPerPage, 'desc');
        setCurrentPage(newPage);
      }
    };
  
    const handleNextPage = () => {
      if (currentPage < searchResults.meta.totalPages) {
        const newPage = currentPage + 1;
        performSearch(searchTerm, searchField, newPage, searchResults.meta.itemPerPage, 'desc');
        setCurrentPage(newPage);
      }
    };
  
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR');
    };
  
    return (
      <main className="main-content">
        <h2>검색결과"{searchTerm}"</h2>
        {searchResults.posts.length > 0 ? (
          searchResults.posts.map((post) => (
            <Link to={`/post/${post.id}`} key={post.id} className="post-card">
              <div className="post-info">
                <div className="post-title">{post.title || '제목 없음'}</div>
                <div className="post-description">{(post.preview || '').substring(0, 20)}</div>
                <div className="post-author">작성자 ID: {post.userId}</div>
                <div className="post-date">생성일: {formatDate(post.createdAt)}</div>
              </div>
            </Link>
          ))
        ) : (
          <p>No posts found.</p>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={searchResults.meta.totalPages}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        />
      </main>
    );
  }

export default SearchResultsPage;
