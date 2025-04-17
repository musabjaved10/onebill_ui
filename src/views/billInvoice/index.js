import React, { useState, useEffect } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton } from '@coreui/react';
import SpinnerOverlay from '../../components/SpinnerOverlay';
import Pagination from '../../components/Pagination';
import api from '../../api/apiWrapper';
import { toast, ToastContainer } from 'react-toastify';
import ConfirmationModal from '../../components/ConfirmationModal';
import { format } from 'date-fns';

const Bills = () => {
    const [billInvoices, setBillInvoices] = useState([]);
    const [filteredBills, setFilteredBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

    const fetchBills = async (page = 1) => {
        try {
            setLoading(true);
            const response = await api.get(`/bills/invoices?page=${page}&sort=-createdAt`);
            console.log('data is', response.data);

            const invoices = response.data.data.invoices;
            setBillInvoices(invoices);
            setFilteredBills(invoices);
            setPagination(response.data.data.pagination);
        } catch (error) {
            console.error('Error fetching bills:', error);
            toast.error('Failed to fetch bill invoices!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBills(currentPage);
    }, [currentPage]);

    useEffect(() => {
        setFilteredBills(billInvoices);
    }, [billInvoices]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        const filtered = billInvoices.filter((billInvoice) =>
            (billInvoice.bill_account?.account_number ?? '').toLowerCase().includes(value) ||
            (billInvoice.bill_account?.bill_category?.name ?? '').toLowerCase().includes(value) ||
            (billInvoice.bill_account?.bill_vendor?.provider_name ?? '').toLowerCase().includes(value) ||
            (billInvoice.amount?.toString() ?? '').includes(value) ||
            (billInvoice.month ?? '').toLowerCase().includes(value) ||
            (billInvoice.year?.toString() ?? '').includes(value) ||
            (billInvoice.status ?? '').toLowerCase().includes(value)
        );

        setFilteredBills(filtered);
    };

    const handleDeleteClick = (invoiceId) => {
        setSelectedInvoiceId(invoiceId);
        setShowModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedInvoiceId) return;

        try {
            await api.delete(`/bills/invoices/${selectedInvoiceId}`);
            toast.success('Invoice deleted successfully!');
            fetchBills(currentPage);
        } catch (error) {
            console.error('Error deleting invoice:', error);
            toast.error('Failed to delete invoice!');
        } finally {
            setShowModal(false);
            setSelectedInvoiceId(null);
        }
    };

    return (
        <div>
            <SpinnerOverlay isLoading={loading} />

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

            <div className="mb-2">
                Showing {filteredBills.length} of {pagination.totalInvoices || 0} invoices
            </div>

            <CTable bordered responsive>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col">S.No</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Account Number</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Bill Category</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Provider Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Month / Year</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Created At</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {filteredBills.map((billInvoice, index) => (
                        <CTableRow key={billInvoice._id}>
                            <CTableHeaderCell scope="row">
                                {pagination.limit * (currentPage - 1) + index + 1}
                            </CTableHeaderCell>
                            <CTableDataCell>{billInvoice.bill_account?.account_number ?? 'N/A'}</CTableDataCell>
                            <CTableDataCell>{billInvoice.bill_account?.bill_category?.name ?? 'N/A'}</CTableDataCell>
                            <CTableDataCell>{billInvoice.bill_account?.bill_vendor?.provider_name ?? 'N/A'}</CTableDataCell>
                            <CTableDataCell>{"$" + (billInvoice.amount?.toFixed(2) ?? 'N/A')}</CTableDataCell>
                            <CTableDataCell>{(billInvoice.month ?? 'N/A') + " / " + (billInvoice.year ?? 'N/A')}</CTableDataCell>
                            <CTableDataCell>
                                {billInvoice.createdAt ? format(new Date(billInvoice.createdAt), 'MMM dd, yyyy HH:mm') : 'N/A'}
                            </CTableDataCell>
                            <CTableDataCell>
                                <span className={`badge ${billInvoice.status === 'paid' ? 'bg-success' : 'bg-warning'}`}>
                                    {billInvoice.status === 'paid' ? 'Paid' : 'Pending'}
                                </span>
                            </CTableDataCell>
                            <CTableDataCell>
                                <div className="d-flex gap-2">
                                    <a href={`/#/edit-invoice/${billInvoice._id}`} className="btn btn-primary btn-sm">
                                        Edit
                                    </a>
                                    <CButton color="danger" size="sm" onClick={() => handleDeleteClick(billInvoice._id)}>
                                        Delete
                                    </CButton>
                                </div>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>

            <Pagination
                totalPages={pagination.totalPages || 1}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />

            <ConfirmationModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onConfirm={handleDeleteConfirm}
                message="Are you sure you want to delete this invoice?"
            />

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default Bills;