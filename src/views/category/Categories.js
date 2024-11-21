// UserTable.js
import React, { useState, useEffect } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';
import SpinnerOverlay from '../../components/SpinnerOverlay';
import Pagination from '../../components/Pagination';
import api from '../../api/apiWrapper';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    const fetchCategories = async (page = 1) => {
        try {
            setLoading(true); // Show spinner
            const response = await api.get(`/bills/categories?page=${page}`);
            console.log('data is', response.data);

            setCategories(response.data.data.categories); // Set users
            setPagination(response.data.data.pagination); // Set pagination info
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false); // Hide spinner
        }
    };

    useEffect(() => {
        fetchCategories(currentPage); // Fetch users for the current page
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page); // Update current page state
    };

    return (
        <div>
            <SpinnerOverlay isLoading={loading} />

            <div className="d-flex justify-content-end mb-3">
                <a href="/#/add-category" className="btn btn-primary">Add Category</a>
            </div>
            <CTable bordered>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col">S.No</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Category Name</CTableHeaderCell>

                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {categories.map((category, index) => (
                        <CTableRow key={category._id}>
                            <CTableHeaderCell scope="row">
                                {pagination.limit * (currentPage - 1) + index + 1}
                            </CTableHeaderCell>
                            <CTableDataCell>{category.name}</CTableDataCell>
                            <CTableDataCell>
                            <a href={`/#/edit-category/${category._id}`} className="btn btn-primary btn-sm me-2">
                                    Edit
                                </a>
                                <button className="btn btn-danger btn-sm">Delete</button>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
            {/* Pagination Component */}
            <Pagination
                totalPages={pagination.totalPages || 1}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default Categories;
