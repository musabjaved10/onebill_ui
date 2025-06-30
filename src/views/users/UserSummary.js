import React, { useState, useEffect } from 'react';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CTable,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CButton,
    CImage,
} from '@coreui/react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/apiWrapper';
import SpinnerOverlay from '../../components/SpinnerOverlay';

const UserSummary = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [invoices, setInvoices] = useState([]);
    const [billsHistory, setBillsHistory] = useState({});
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalInvoices: 0,
        totalPages: 1,
    });

    // Fetch user details and invoices
    const fetchData = async () => {
        try {
            setLoading(true);
            const userResponse = await api.get(`/users/${id}`);
            const billsHistoryResponse = await api.get(`/stats/bills/user/${id}`);
            const invoicesResponse = await api.get(`/bills/invoices/user/${id}`, {
                params: {
                    page: pagination.page,
                    limit: pagination.limit,
                },
            });

            setUser(userResponse.data.data);
            setBillsHistory(billsHistoryResponse.data.data);
            setInvoices(invoicesResponse.data.data.invoices);
            setPagination(invoicesResponse.data.data.pagination);
        } catch (err) {
            console.error('Failed to load data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id, pagination.page, pagination.limit]);

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    const formatDate = (isoString) => {
        if (!isoString) return 'N/A'; // Handle null or undefined dates

        const date = new Date(isoString);
        const day = date.getDate().toString().padStart(2, '0'); // Ensure 2 digits for day
        const month = date.toLocaleString('default', { month: 'short' }).toUpperCase(); // Get short month name (e.g., FEB)
        const year = date.getFullYear(); // Get full year

        return `${day}-${month}-${year}`; // Format: 18-FEB-2024
    };

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    const formatAmount = (amount) => {
        if (typeof amount !== 'number') return '0.00'; // Handle non-numeric values
        return amount.toFixed(2); // Format to 2 decimal places
    };

    return (
        <div className="user-summary-container">
            <SpinnerOverlay isLoading={loading} />

            <CCard className="user-summary-card">
                <CCardHeader className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">User Summary</h5>
                    <CButton color="secondary" size="sm" onClick={handleBack}>
                        Back
                    </CButton>
                </CCardHeader>
                <CCardBody>
                    {/* Profile Picture */}
                    <div className="text-center mb-4">
                        <CImage
                            src={user.profile_picture || 'https://www.flaticon.com/free-icon/user_709699'}
                            alt="Profile Picture"
                            thumbnail
                            style={{ width: '150px', height: '150px', borderRadius: '50%' }}
                        />
                    </div>

                    {/* User Details Table */}
                    <CTable bordered hover responsive className="mb-5 dark-text-table">
                        <tbody>
                            <CTableRow>
                                <CTableHeaderCell>First Name</CTableHeaderCell>
                                <CTableDataCell>{user.first_name || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableHeaderCell>Middle Name</CTableHeaderCell>
                                <CTableDataCell>{user.middle_name || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableHeaderCell>Last Name</CTableHeaderCell>
                                <CTableDataCell>{user.last_name || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableHeaderCell>Email</CTableHeaderCell>
                                <CTableDataCell>{user.email || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableHeaderCell>Phone Number</CTableHeaderCell>
                                <CTableDataCell>{user.phone_number || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableHeaderCell>Address</CTableHeaderCell>
                                <CTableDataCell>{user.address || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableHeaderCell>Username</CTableHeaderCell>
                                <CTableDataCell>{user.username || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableHeaderCell>OneBill UID</CTableHeaderCell>
                                <CTableDataCell>{user.onebill_uid || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableHeaderCell>Stripe Customer ID</CTableHeaderCell>
                                <CTableDataCell>{user.stripe_customer_id || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableHeaderCell>Is Admin</CTableHeaderCell>
                                <CTableDataCell>{user.is_admin ? 'Yes' : 'No'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableHeaderCell>Is Verified</CTableHeaderCell>
                                <CTableDataCell>{user.is_verified ? 'Yes' : 'No'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableHeaderCell>Date Created</CTableHeaderCell>
                                <CTableDataCell>{formatDate(user.createdAt)}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableHeaderCell>Last Updated</CTableHeaderCell>
                                <CTableDataCell>{formatDate(user.updatedAt)}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableHeaderCell>Current Month Bill</CTableHeaderCell>
                                <CTableDataCell>${formatAmount(billsHistory.monthly_bill_comparison?.current_month_total_bill || 0)}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableHeaderCell>Last Month Bill</CTableHeaderCell>
                                <CTableDataCell>${formatAmount(billsHistory.monthly_bill_comparison?.last_month_total_bill || 0)}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableHeaderCell>Percent Change</CTableHeaderCell>
                                <CTableDataCell>{billsHistory.monthly_bill_comparison?.percentage_change || 0}%</CTableDataCell>
                            </CTableRow>
                        </tbody>
                    </CTable>

                    {/* Bills History Section */}
                    <h5 className="mt-5 text-dark">Bills History</h5>
                    <CTable bordered hover responsive className="text-dark mb-5 dark-text-table">
                        <thead>
                            <CTableRow>
                                <CTableHeaderCell>Metric</CTableHeaderCell>
                                <CTableHeaderCell>This Month</CTableHeaderCell>
                                <CTableHeaderCell>Last 6 Months</CTableHeaderCell>
                                <CTableHeaderCell>This Year</CTableHeaderCell>
                                <CTableHeaderCell>Overall</CTableHeaderCell>
                            </CTableRow>
                        </thead>
                        <tbody>
                            <CTableRow>
                                <CTableDataCell>Average Bill Amount</CTableDataCell>
                                <CTableDataCell>${formatAmount(billsHistory.average_bill_amount?.this_month || 0)}</CTableDataCell>
                                <CTableDataCell>${formatAmount(billsHistory.average_bill_amount?.six_month || 0)}</CTableDataCell>
                                <CTableDataCell>${formatAmount(billsHistory.average_bill_amount?.this_year || 0)}</CTableDataCell>
                                <CTableDataCell>${formatAmount(billsHistory.average_bill_amount?.overall || 0)}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell>Paid Bills</CTableDataCell>
                                <CTableDataCell>${formatAmount(billsHistory.paid_bills?.this_month?.amount || 0)}</CTableDataCell>
                                <CTableDataCell>${formatAmount(billsHistory.paid_bills?.six_month?.amount || 0)}</CTableDataCell>
                                <CTableDataCell>${formatAmount(billsHistory.paid_bills?.this_year?.amount || 0)}</CTableDataCell>
                                <CTableDataCell>N/A</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell>Overdue Bills</CTableDataCell>
                                <CTableDataCell></CTableDataCell>
                                <CTableDataCell></CTableDataCell>
                                <CTableDataCell></CTableDataCell>
                                <CTableDataCell>${formatAmount(billsHistory.overdue_bills?.total_amount || 0)}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell>Current Due Bills</CTableDataCell>
                                <CTableDataCell></CTableDataCell>
                                <CTableDataCell></CTableDataCell>
                                <CTableDataCell></CTableDataCell>
                                <CTableDataCell>${formatAmount(billsHistory.current_due_bills?.total_amount || 0)}</CTableDataCell>
                            </CTableRow>
                        </tbody>
                    </CTable>

                    {/* Invoices Table */}
                    <h5 className="mt-5 text-dark">Invoices</h5>
                    <CTable bordered hover responsive className="text-dark invoices-table">
                        <thead>
                            <CTableRow>
                                <CTableHeaderCell>Invoice ID</CTableHeaderCell>
                                <CTableHeaderCell>Amount</CTableHeaderCell>
                                <CTableHeaderCell>Bill Category</CTableHeaderCell>
                                <CTableHeaderCell>Bill Vendor</CTableHeaderCell>
                                <CTableHeaderCell>Due Date</CTableHeaderCell>
                                <CTableHeaderCell>Status</CTableHeaderCell>
                                <CTableHeaderCell>Payment Date</CTableHeaderCell>
                            </CTableRow>
                        </thead>
                        <tbody>
                            {invoices.map((invoice) => (
                                <CTableRow key={invoice._id}>
                                    <CTableDataCell>{invoice._id}</CTableDataCell>
                                    <CTableDataCell>${invoice.amount}</CTableDataCell>
                                    <CTableDataCell>{invoice.bill_account?.bill_category?.name}</CTableDataCell>
                                    <CTableDataCell>{invoice.bill_account?.bill_vendor?.name}</CTableDataCell>
                                    <CTableDataCell>{formatDate(invoice.due_date)}</CTableDataCell>
                                    <CTableDataCell>{invoice.status}</CTableDataCell>
                                    <CTableDataCell>{formatDate(invoice.payment_info?.payment_date)}</CTableDataCell>
                                </CTableRow>
                            ))}
                        </tbody>
                    </CTable>

                    {/* Pagination */}
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <CButton
                            color="primary"
                            size="sm"
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                        >
                            Previous
                        </CButton>
                        <span>
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <CButton
                            color="primary"
                            size="sm"
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages}
                        >
                            Next
                        </CButton>
                    </div>
                </CCardBody>
            </CCard>
        </div>
    );
};

export default UserSummary;