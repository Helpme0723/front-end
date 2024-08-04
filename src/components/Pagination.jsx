import React from "react";
import Pagination from "react-js-pagination";
import "../styles/components/Pagination.css"


const PaginationComponent = ({ activePage, itemsCountPerPage, totalItemsCount, pageRangeDisplayed, onChange}) => {
	return (
		<div className="pagination-container">
			<Pagination
			activePage={activePage} // 현재 활성화된 페이지
			itemsCountPerPage={itemsCountPerPage} // 페이지당 항목 수
			totalItemsCount={totalItemsCount} // 총 항목 수
			pageRangeDisplayed={pageRangeDisplayed} // 표시할 페이지 범위
			onChange={onChange} // 페이지 변경 시 호출할 함수
			innerClass="pagination" // 페이지네이션 컨테이너 클래스
			itemClass="page-item" // 페이지 항목 클래스
			linkClass="page-link" // 링크 클래스
			activeClass="active" // 활성화된 페이지 클래스
			/>
		</div>
	);
};

export default PaginationComponent;