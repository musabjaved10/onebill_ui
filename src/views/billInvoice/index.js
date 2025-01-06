import React, { useState, useEffect } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';
import SpinnerOverlay from '../../components/SpinnerOverlay';
import Pagination from '../../components/Pagination';
import api from '../../api/apiWrapper';

const Bills = () => {
    const [billInvoices, setBillInvoices] = useState([]);
    // const [filteredBills, setFilteredBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchBills = async (page = 1) => {
        try {
            setLoading(true); // Show spinner
            const response = await api.get(`/bills/invoices`);
            console.log('data is', response.data);

            const billInvoice = response.data.data.invoices;
            setBillInvoices(billInvoice); // Set bills
            setFilteredBills(billInvoice); // Set filtered bills initially
            setPagination(response.data.data.pagination); // Set pagination info
        } catch (error) {
            console.error('Error fetching bills:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBills(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

    // Filter bills based on the search term
    const filtered = billInvoices.filter((billInvoice) =>
        billInvoice.bill_account.account_number.includes(value) ||
        billInvoice.bill_account.bill_category.name.toLowerCase().includes(value) ||
        billInvoice.bill_account.bill_vendor.provider_name.toLowerCase().includes(value) ||
        billInvoice.amount.includes(value) ||
        billInvoice.month.includes(value) ||
        billInvoice.year.includes(value) ||
        billInvoice.status.toLowerCase().includes(value)
    );

    setFilteredBills(filtered);
    };

    return (
        <div>
            <SpinnerOverlay isLoading={loading} />

            {/* Search Bar */}
            {/* <div className="d-flex justify-content-between mb-3">
                <input
                    type="text"
                    className="form-control w-50"
                    placeholder="Search bills..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div> */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <input
                    type="text"
                    className="form-control w-50"
                    placeholder="Search bill invoice..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <a href="/#/create-invoice" className="btn btn-primary">Create Invoice</a>
            </div>

            <CTable bordered>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col">S.No</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Account Number</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Bill Category</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Provider Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Month / Year</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {billInvoices.map((billInvoice, index) => (
                        <CTableRow key={billInvoice._id}>
                            <CTableHeaderCell scope="row">
                                {pagination.limit * (currentPage - 1) + index + 1}
                            </CTableHeaderCell>
                            <CTableDataCell>{billInvoice.bill_account.account_number ?? ''}</CTableDataCell>
                            <CTableDataCell>{billInvoice.bill_account.bill_category.name ?? ''}</CTableDataCell>
                            <CTableDataCell>{billInvoice.bill_account.bill_vendor.provider_name ?? ''}</CTableDataCell>
                            <CTableDataCell>{"$" + billInvoice.amount ?? ''}</CTableDataCell>
                            <CTableDataCell>{billInvoice.month + "-" + billInvoice.year}</CTableDataCell>
                            <CTableDataCell>
                                <span
                                    className={`badge ${billInvoice.status === 'paid' ? 'bg-success' : 'bg-warning'
                                        }`}
                                >
                                    {billInvoice.status === 'paid' ? 'Paid' : 'Not Paid'}
                                </span>
                            </CTableDataCell>
                            <CTableDataCell>
                                {/* <a href={`/#/edit-bill/${billInvoice._id}`} className="btn btn-primary btn-sm me-2">
                                    Edit
                                </a> */}
                                <button className="btn btn-primary btn-sm">Edit</button>
                                <button className="btn btn-secondary btn-sm">View</button>
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

export default Bills;
