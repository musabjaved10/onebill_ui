import React, { useState, useEffect } from 'react';

import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';
import SpinnerOverlay from '../../components/SpinnerOverlay';
import Pagination from '../../components/Pagination';
import api from '../../api/apiWrapper';



const Bills = () => {

    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    var status = "Pending";

    const fetchBills = async (page = 1) => {
        try {
            setLoading(true); // Show spinner
            const response = await api.get(`/bills/accounts?page=${page}`);
            console.log('data is', response.data);

            setBills(response.data.data.accounts); // Set users
            // setPagination(response.data.data.pagination); // Set pagination info
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false); // Hide spinner
        }
    };

    useEffect(() => {
        fetchBills(currentPage); // Fetch users for the current page
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page); // Update current page state
    };


    return (
        <div>
            <SpinnerOverlay isLoading={loading} />

            {/* <div className="d-flex justify-content-end mb-3">
                <a href="/#/add-bill" className="btn btn-primary">Add Category</a>
            </div> */}
            <CTable bordered>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col">S.No</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Account Number</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Providor Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Providor Email</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Providor Website</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                {bills.map((bill, index) => (
                        <CTableRow key={bill._id}>
                            <CTableHeaderCell scope="row">1
                                {/* {pagination.limit * (currentPage - 1) + index + 1} */}
                            </CTableHeaderCell>
                        <CTableDataCell>{bill.first_name_on_bill + " " + bill.last_name_on_bill}</CTableDataCell>
                        <CTableDataCell>{bill.account_number ?? ''}</CTableDataCell>
                        <CTableDataCell>{bill.service_provider_info.provider_name ?? ''}</CTableDataCell>
                        <CTableDataCell>{bill.service_provider_info.email ?? ''}</CTableDataCell>
                        <CTableDataCell>{bill.service_provider_info.website ?? ''}</CTableDataCell>
                        <CTableDataCell>
                            <span className={`badge ${bill.status === 'pending' ? 'bg-warning' : bill.status === 'approved' ? 'bg-success' : 'bg-secondary'}`}>
                                {bill.status}
                            </span>
                        </CTableDataCell>
                        <CTableDataCell>
                            {/* <button className="btn btn-primary btn-sm me-2">Edit</button> */}
                            <a href={`/#/edit-bill/${bill._id}`} className="btn btn-primary btn-sm me-2">Edit</a>

                            <button className="btn btn-danger btn-sm">Delete</button>
                        </CTableDataCell>
                    </CTableRow>
                ))}
                   
                </CTableBody>
            </CTable>
             {/* Pagination Component */}
             {/* <Pagination
                totalPages={pagination.totalPages || 1}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            /> */}
        </div>
    );
};

export default Bills;
