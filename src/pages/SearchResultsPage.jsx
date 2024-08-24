import React, { useContext, useState, useEffect } from 'react';
import { SearchContext } from '../context/SearchContext';
import { Link } from 'react-router-dom';
import Pagination from '../components/Testpagenation';
import '../styles/pages/SearchResultsPage.css';

function SearchResultsPage() {
  const { searchResults, performSearch, searchTerm, searchField } =
    useContext(SearchContext);
  const [currentPage, setCurrentPage] = useState(
    searchResults.meta.currentPage,
  );

  useEffect(() => {
    setCurrentPage(searchResults.meta.currentPage);
  }, [searchResults.meta.currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      performSearch(
        searchTerm,
        searchField,
        newPage,
        searchResults.meta.itemPerPage,
        'desc',
      );
      setCurrentPage(newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < searchResults.meta.totalPages) {
      const newPage = currentPage + 1;
      performSearch(
        searchTerm,
        searchField,
        newPage,
        searchResults.meta.itemPerPage,
        'desc',
      );
      setCurrentPage(newPage);
    }
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <>
      <br></br>
      <h2 className="search-result-tag">검색결과 "{searchTerm}"</h2>
      <main className="search-result-main-content">
        {searchResults.posts.length > 0 ? (
          searchResults.posts.map(post => (
            <Link
              to={`/post/${post.id}`}
              key={post.id}
              className="search-result-post-card"
            >
              <div
                className={`search-result-post-type ${post.price > 0 ? 'search-result-post-paid' : 'search-result-post-free'}`}
              >
                {post.price > 0 ? '유료' : '무료'}
              </div>
              <div className="search-result-post-info">
                <div className="search-result-post-title">
                  {post.title || '제목 없음'}
                </div>
                <div className="search-result-post-description">
                  {(post.preview || '').substring(0, 20)}
                </div>
                <div className="search-result-post-author">
                  <img
                    src={post.profileUrl}
                    alt={`Profile of ${post.nickname}`}
                    className="search-result-profile-image"
                  />
                  작성자: {post.nickname}
                </div>
                <div className="search-result-post-meta">
                  <div className="search-result-post-date">
                    생성일: {formatDate(post.createdAt)}
                  </div>
                  {post.price > 0 && (
                    <div className="search-result-post-price">
                      가격: {post.price.toLocaleString('ko-KR')} 포인트
                    </div>
                  )}
                </div>
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
    </>
  );
}

export default SearchResultsPage;
