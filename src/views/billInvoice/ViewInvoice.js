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

const ViewInvoice = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [invoice, setInvoice] = useState([]);
    const [loading, setLoading] = useState(true);


    // Fetch user details and invoices
    const fetchData = async () => {
        try {
            setLoading(true);
            console.log(id);
            const invoice = await api.get(`/bills/invoices/${id}`);

            console.log(invoice)
            // setInvoice(invoicesResponse.data.data.invoices);
        } catch (err) {
            console.error('Failed to load data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

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

                    {/* User Details Table */}
                    <CTable borderless hover responsive className="text-dark">
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
                    </CTable>

                </CCardBody>
            </CCard>
        </div>
    );
};

export default ViewInvoice;