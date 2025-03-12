import React, { useState, useEffect } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton } from '@coreui/react';
import SpinnerOverlay from '../../components/SpinnerOverlay';
import Pagination from '../../components/Pagination';
import api from '../../api/apiWrapper';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import ConfirmationModal from '../../components/ConfirmationModal'; // Adjust the path as per your project structure

const Bills = () => {
    const [billInvoices, setBillInvoices] = useState([]);
    const [filteredBills, setFilteredBills] = useState([]); // State for filtered bills
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

    const fetchBills = async (page = 1) => {
        try {
            setLoading(true); // Show spinner
            const response = await api.get(`/bills/invoices`);
            console.log('data is', response.data);

            const billInvoice = response.data.data.invoices;
            setBillInvoices(billInvoice); // Set bills
            setFilteredBills(billInvoice); // Initialize filteredBills with billInvoices
            setPagination(response.data.data.pagination); // Set pagination info
        } catch (error) {
            console.error('Error fetching bills:', error);
            toast.error('Failed to fetch bill invoices!'); // Show error toast
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBills(currentPage);
    }, [currentPage]);

    useEffect(() => {
        setFilteredBills(billInvoices); // Update filteredBills when billInvoices changes
    }, [billInvoices]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        // Filter bills based on the search term
        const filtered = billInvoices.filter((billInvoice) =>
            (billInvoice.bill_account?.account_number ?? '').toLowerCase().includes(value) ||
            (billInvoice.bill_account?.bill_category?.name ?? '').toLowerCase().includes(value) ||
            (billInvoice.bill_account?.bill_vendor?.provider_name ?? '').toLowerCase().includes(value) ||
            (billInvoice.amount?.toString() ?? '').includes(value) || // Convert amount to string
            (billInvoice.month ?? '').toLowerCase().includes(value) ||
            (billInvoice.year?.toString() ?? '').includes(value) || // Convert year to string
            (billInvoice.status ?? '').toLowerCase().includes(value)
        );

        setFilteredBills(filtered); // Update filteredBills state
    };

    const handleDeleteClick = (invoiceId) => {
        setSelectedInvoiceId(invoiceId); // Set the selected invoice ID
        setShowModal(true); // Show the confirmation modal
    };

    const handleDeleteConfirm = async () => {
        if (!selectedInvoiceId) return;

        try {
            await api.delete(`/bills/invoices/${selectedInvoiceId}`); // Delete the invoice
            toast.success('Invoice deleted successfully!'); // Show success toast
            fetchBills(currentPage); // Refresh the invoice list
        } catch (error) {
            console.error('Error deleting invoice:', error);
            toast.error('Failed to delete invoice!'); // Show error toast
        } finally {
            setShowModal(false); // Hide the modal
            setSelectedInvoiceId(null); // Reset the selected invoice ID
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
                    {filteredBills.map((billInvoice, index) => (
                        <CTableRow key={billInvoice._id}>
                            <CTableHeaderCell scope="row">
                                {pagination.limit * (currentPage - 1) + index + 1}
                            </CTableHeaderCell>
                            <CTableDataCell>{billInvoice.bill_account?.account_number ?? 'N/A'}</CTableDataCell>
                            <CTableDataCell>{billInvoice.bill_account?.bill_category?.name ?? 'N/A'}</CTableDataCell>
                            <CTableDataCell>{billInvoice.bill_account?.bill_vendor?.provider_name ?? 'N/A'}</CTableDataCell>
                            <CTableDataCell>{"$" + (billInvoice.amount ?? 'N/A')}</CTableDataCell>
                            <CTableDataCell>{(billInvoice.month ?? 'N/A') + "-" + (billInvoice.year ?? 'N/A')}</CTableDataCell>
                            <CTableDataCell>
                                <span
                                    className={`badge ${billInvoice.status === 'paid' ? 'bg-success' : 'bg-warning'
                                        }`}
                                >
                                    {billInvoice.status === 'paid' ? 'Paid' : 'Not Paid'}
                                </span>
                            </CTableDataCell>
                            <CTableDataCell>
                                <a href={`/#/edit-invoice/${billInvoice._id}`} className="btn btn-primary btn-sm me-2">
                                    Edit
                                </a>
                                {/* <a href={`/#/view-invoice/${billInvoice._id}`} className="btn btn-secondary btn-sm me-2">
                                    View
                                </a> */}
                                {/* <button className="btn btn-secondary btn-sm">View</button> */}
                                <CButton color="danger" size="sm" onClick={() => handleDeleteClick(billInvoice._id)}>
                                    Delete
                                </CButton>
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

            {/* Confirmation Modal */}
            <ConfirmationModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onConfirm={handleDeleteConfirm}
                message="Do you really want to delete this invoice?"
            />

            {/* Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={3000} // Auto close after 3 seconds
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
