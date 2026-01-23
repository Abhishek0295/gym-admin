import { useState, useMemo } from 'react';
import { ITEMS_PER_PAGE } from '../utils/constants';

interface UsePaginationProps {
  initialPage?: number;
  initialLimit?: number;
}

export const usePagination = ({ 
  initialPage = 1, 
  initialLimit = ITEMS_PER_PAGE 
}: UsePaginationProps = {}) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const paginationParams = useMemo(() => ({
    page,
    limit,
    offset: (page - 1) * limit,
  }), [page, limit]);

  const goToPage = (newPage: number) => {
    setPage(newPage);
  };

  const goToNextPage = () => {
    setPage(prev => prev + 1);
  };

  const goToPreviousPage = () => {
    setPage(prev => Math.max(1, prev - 1));
  };

  const resetPagination = () => {
    setPage(1);
  };

  return {
    ...paginationParams,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    resetPagination,
    setLimit,
  };
};