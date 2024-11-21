// UserTable.js
import React, { useState, useEffect } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';

import SpinnerOverlay from '../../components/SpinnerOverlay';
import Pagination from '../../components/Pagination';
import api from '../../api/apiWrapper';

const Vendors = () => {

    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);


    const fetchVendors = async (page = 1) => {
        try {
            setLoading(true); // Show spinner
            const response = await api.get(`/bills/vendors?page=${page}`);
            console.log('data is', response.data);

            setVendors(response.data.data.vendors); // Set users
            setPagination(response.data.data.pagination); // Set pagination info
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false); // Hide spinner
        }
    };

    useEffect(() => {
        fetchVendors(currentPage); // Fetch users for the current page
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page); // Update current page state
    };

    return (
        <div>
            <SpinnerOverlay isLoading={loading} />

            <div className="d-flex justify-content-end mb-3">
                <a href="/#/add-vendor" className="btn btn-primary">Add Vendor</a>
            </div>
            <CTable bordered>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col">S.No</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Vendor Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>

                    {vendors.map((vendor, index) => (
                        <CTableRow key={vendor._id}>
                            <CTableHeaderCell scope="row">
                                {pagination.limit * (currentPage - 1) + index + 1}
                            </CTableHeaderCell>
                            <CTableDataCell>{vendor.provider_name ?? ''}</CTableDataCell>
                            <CTableDataCell>{vendor.bill_category.name ?? ''}</CTableDataCell>
                            <CTableDataCell>
                            <a href={`/#/edit-vendor/${vendor._id}`} className="btn btn-primary btn-sm me-2">
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

export default Vendors;
