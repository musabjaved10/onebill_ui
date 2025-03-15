import React, { useState, useEffect } from 'react';
import {
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CButton,
} from '@coreui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import SpinnerOverlay from '../../components/SpinnerOverlay';
import Pagination from '../../components/Pagination';
import api from '../../api/apiWrapper';
import ConfirmationModal from '../../components/ConfirmationModal'; // Adjust the path as per your project structure

const AllUserBills = () => {
    const { id } = useParams();

    const [userbills, serUserBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    // const [selectedUserId, setSelectedUserId] = useState(null);

    const fetchUsers = async (page = 1) => {
        try {
            setLoading(true); // Show spinner
            const response = await api.get(`/bills/invoices/user/${id}?page=${page}`);
            console.log('data is', response);

            serUserBills(response.data.data.invoices); // Set users
            setPagination(response.data.data.pagination); // Set pagination info
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users!'); // Show error toast
        } finally {
            setLoading(false); // Hide spinner
        }
    };

    useEffect(() => {
        fetchUsers(currentPage); // Fetch users for the current page
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page); // Update current page state
    };

    // const handleDeleteClick = (userId) => {
    //     setSelectedUserId(userId); // Set the selected user ID
    //     setShowModal(true); // Show the confirmation modal
    // };

    // const handleDeleteConfirm = async () => {
    //     if (!selectedUserId) return;

    //     try {
    //         await api.delete(`/users/${selectedUserId}`); // Delete the user
    //         toast.success('User deleted successfully!'); // Show success toast
    //         fetchUsers(currentPage); // Refresh the user list
    //     } catch (error) {
    //         console.error('Error deleting user:', error);
    //         toast.error('Failed to delete user!'); // Show error toast
    //     } finally {
    //         setShowModal(false); // Hide the modal
    //         setSelectedUserId(null); // Reset the selected user ID
    //     }
    // };

    return (
        <div>
            <SpinnerOverlay isLoading={loading} />
            <CTable bordered>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col">S.No</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Bill Category</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Bill Vendor</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Month/Year</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Amount Paid</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Mode Of Payment</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                        {/* <CTableHeaderCell scope="col">Action</CTableHeaderCell> */}
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {userbills.map((bill, index) => (
                        <CTableRow key={bill._id}>
                            <CTableHeaderCell scope="row">
                                {pagination.limit * (currentPage - 1) + index + 1}
                            </CTableHeaderCell>
                            <CTableDataCell>{bill.added_by?.first_name + ' ' + bill.added_by?.last_name}</CTableDataCell>
                            <CTableDataCell>{bill.bill_account?.bill_category?.name ?? '' }</CTableDataCell>
                            <CTableDataCell>{bill.bill_account?.bill_vendor?.name ?? '' }</CTableDataCell>
                            <CTableDataCell>{bill.month + ' ' + bill.year || 'N/A'}</CTableDataCell>
                            <CTableDataCell>{bill.amount || 'N/A'}</CTableDataCell>
                            <CTableDataCell>{bill.payment_info?.amount_paid || 'N/A'}</CTableDataCell>
                            <CTableDataCell>{bill.payment_info?.mode_of_payment || 'N/A'}</CTableDataCell>
                            <CTableDataCell>
                                <span className={`badge ${bill.is_paid == false ? 'bg-warning' : bill.is_paid == true ? 'bg-success' : 'bg-secondary'}`}>
                                    {bill.is_paid === true ? 'Paid' : 'Not Paid'}
                                </span>
                            </CTableDataCell>
                            {/* <CTableDataCell>
                                <a href={`/#/bill-summary/${bill._id}`} className="btn btn-secondary btn-sm me-2">
                                    Summary
                                </a>
                                <a href={`/#/bill-bills/${bill._id}`} className="btn btn-secondary btn-sm me-2">
                                    Bills
                                </a>
                                <a href={`/#/edit-bill/${bill._id}`} className="btn btn-primary btn-sm me-2">
                                    Edit
                                </a>
                                <CButton color="danger" size="sm" onClick={() => handleDeleteClick(bill._id)}>
                                    Delete
                                </CButton>
                            </CTableDataCell> */}
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
            {/* <ConfirmationModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onConfirm={handleDeleteConfirm}
                message="Do you really want to delete this user?"
            /> */}

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

export default AllUserBills;
