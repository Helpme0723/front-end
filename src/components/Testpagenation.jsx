import React from 'react';
import PropTypes from 'prop-types';
import '../styles/components/Pagination.css'

function Pagination({ currentPage, totalPages, onPrevPage, onNextPage }) {
  return (
    <div className="pagination">
      <button onClick={onPrevPage} disabled={currentPage === 1}>
        이전
      </button>
      <span>
        페이지 {currentPage} / {totalPages}
      </span>
      <button onClick={onNextPage} disabled={currentPage === totalPages}>
        다음
      </button>
    </div>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPrevPage: PropTypes.func.isRequired,
  onNextPage: PropTypes.func.isRequired,
};

export default Pagination;
