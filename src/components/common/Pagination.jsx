'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    showPageNumbers = true,
    siblingCount = 1
}) => {
    // Number type cast to ensure smooth comparison
    const currPage = Number(currentPage) || 1;
    const totalPg = Number(totalPages) || 1;

    if (totalPg <= 1) return null; // ১ পেজ বা তার কম হলে দেখাবে না

    const generatePageNumbers = () => {
        const totalNumbers = siblingCount * 2 + 3;
        const totalBlocks = totalNumbers + 2;

        if (totalPg <= totalBlocks) {
            return Array.from({ length: totalPg }, (_, i) => i + 1);
        }

        const leftSiblingIndex = Math.max(currPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currPage + siblingCount, totalPg);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPg - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPg;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2 * siblingCount;
            let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
            return [...leftRange, '...', totalPg];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            let rightItemCount = 3 + 2 * siblingCount;
            let rightRange = Array.from({ length: totalPg - rightItemCount + 1 }, (_, i) => totalPg - rightItemCount + i + 1);
            return [firstPageIndex, '...', ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = Array.from(
                { length: rightSiblingIndex - leftSiblingIndex + 1 },
                (_, i) => leftSiblingIndex + i
            );
            return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
        }
    };

    const pages = generatePageNumbers();

    return (
        <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 select-none">
            {/* First Page */}
            <button
                onClick={() => onPageChange(1)}
                disabled={currPage === 1}
                title="First Page"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
                <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Previous Page */}
            <button
                onClick={() => onPageChange(currPage - 1)}
                disabled={currPage === 1}
                title="Previous Page"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            {showPageNumbers && pages?.map((page, index) => {
                if (page === '...') {
                    return (
                        <span key={`dots-${index}`} className="px-3 py-1.5 text-slate-500 text-sm">
                            ...
                        </span>
                    );
                }

                return (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${currPage === page
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        {page}
                    </button>
                );
            })}

            {/* Next Page */}
            <button
                onClick={() => onPageChange(currPage + 1)}
                disabled={currPage === totalPg}
                title="Next Page"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
                <ChevronRight className="w-4 h-4" />
            </button>

            {/* Last Page */}
            <button
                onClick={() => onPageChange(totalPg)}
                disabled={currPage === totalPg}
                title="Last Page"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
                <ChevronsRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Pagination;