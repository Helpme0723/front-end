// src/context/SearchContext.js
import React, { createContext, useState, useCallback } from 'react';
import { searchPosts } from '../apis/search'; // API 호출 함수 가져오기

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('title');
  const [searchResults, setSearchResults] = useState({
    posts: [],
    meta: {
      totalItems: 0,
      itemCount: 0,
      itemPerPage: 10,
      totalPages: 1,
      currentPage: 1,
    },
  });

  const performSearch = useCallback(async (keyword, field, page, limit, sort) => {
    try {
      const response = await searchPosts(keyword, field, page, limit, sort);
      setSearchResults({
        posts: response.posts,
        meta: {
          totalItems: response.meta.totalItems,
          itemCount: response.meta.itemCount,
          itemPerPage: response.meta.itemPerPage,
          totalPages: response.meta.totalPages,
          currentPage: response.meta.currentPage,
        },
      });
      setSearchTerm(keyword);
      setSearchField(field);
      console.log('Search Results Updated:', response);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults({
        posts: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemPerPage: limit,
          totalPages: 1,
          currentPage: 1,
        },
      });
    }
  }, []);

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        searchField,
        setSearchField,
        searchResults,
        setSearchResults,
        performSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
