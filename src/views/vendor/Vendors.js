import React, { useState, useEffect } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';

import SpinnerOverlay from '../../components/SpinnerOverlay';
import Pagination from '../../components/Pagination';
import api from '../../api/apiWrapper';

const Vendors = () => {
    const [vendors, setVendors] = useState([]);
    const [filteredVendors, setFilteredVendors] = useState([]); // For search filter
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState(''); // Search query state

    const fetchVendors = async (page = 1) => {
        try {
            setLoading(true); // Show spinner
            const response = await api.get(`/bills/vendors?page=${page}`);
            console.log('data is', response.data);

            setVendors(response.data.data.vendors); // Set vendors
            setFilteredVendors(response.data.data.vendors); // Set vendors for filtered view
            setPagination(response.data.data.pagination); // Set pagination info
        } catch (error) {
            console.error('Error fetching vendors:', error);
        } finally {
            setLoading(false); // Hide spinner
        }
    };

    useEffect(() => {
        fetchVendors(currentPage); // Fetch vendors for the current page
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page); // Update current page state
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        if (query === '') {
            setFilteredVendors(vendors); // Reset to all vendors when search is empty
        } else {
            const filtered = vendors.filter(
                (vendor) =>
                    vendor.provider_name?.toLowerCase().includes(query) ||
                    vendor.bill_category.name?.toLowerCase().includes(query)
            );
            setFilteredVendors(filtered);
        }
    };

    return (
        <div>
            <SpinnerOverlay isLoading={loading} />

            <div className="d-flex justify-content-between align-items-center mb-3">
                <input
                    type="text"
                    className="form-control w-50"
                    placeholder="Search vendors..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
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
                    {filteredVendors.map((vendor, index) => (
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
