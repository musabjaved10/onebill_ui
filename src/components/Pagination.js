import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const styles = {
        paginationContainer: {
            display: 'flex',
            justifyContent: 'center',
            margin: '20px 0',
        },
        pagination: {
            display: 'flex',
            listStyle: 'none',
            padding: 0,
        },
        pageItem: {
            margin: '0 5px',
            cursor: 'pointer',
        },
        disabled: {
            pointerEvents: 'none',
            opacity: 0.5,
        },
        active: {
            fontWeight: 'bold',
            textDecoration: 'underline',
        },
        pageLink: {
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: '#f8f9fa',
            color: '#007bff',
        },
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];

        // Show the first page
        if (currentPage > 3) {
            pageNumbers.push(1);
            if (currentPage > 4) {
                pageNumbers.push('...');
            }
        }

        // Show current page and the 2 pages before and after it
        for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
            pageNumbers.push(i);
        }

        // Show the last page
        if (currentPage < totalPages - 2) {
            if (currentPage < totalPages - 3) {
                pageNumbers.push('...');
            }
            pageNumbers.push(totalPages);
        }

        return pageNumbers.map((page, index) => {
            if (page === '...') {
                return (
                    <li key={`ellipsis-${index}`} style={styles.pageItem}>
                        <span>...</span>
                    </li>
                );
            }
            return (
                <li
                    key={page}
                    style={{
                        ...styles.pageItem,
                        ...(page === currentPage ? styles.active : {}),
                    }}
                    onClick={() => onPageChange(page)}
                >
                    <span style={styles.pageLink}>{page}</span>
                </li>
            );
        });
    };

    return (
        <nav style={styles.paginationContainer}>
            <ul style={styles.pagination}>
                {/* Previous Button */}
                <li
                    style={{
                        ...styles.pageItem,
                        ...(currentPage === 1 ? styles.disabled : {}),
                    }}
                    onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                >
                    <span style={styles.pageLink}>Previous</span>
                </li>

                {/* Page Numbers */}
                {renderPageNumbers()}

                {/* Next Button */}
                <li
                    style={{
                        ...styles.pageItem,
                        ...(currentPage === totalPages ? styles.disabled : {}),
                    }}
                    onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                >
                    <span style={styles.pageLink}>Next</span>
                </li>
            </ul>
        </nav>
    );
};

// Prop types for type checking
Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
