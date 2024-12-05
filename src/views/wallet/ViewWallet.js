import React from 'react';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CTable,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CButton,
} from '@coreui/react';
import { useNavigate } from 'react-router-dom';

const ViewWallet = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <div className="wallet-container">
            <CCard className="wallet-card">
                <CCardHeader className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Wallet Details</h5>
                    <CButton color="secondary" size="sm" onClick={handleBack}>
                        Back
                    </CButton>
                </CCardHeader>
                <CCardBody>
                    <CTable borderless hover responsive className="wallet-table">
                        <CTableRow>
                            <CTableHeaderCell>Balance</CTableHeaderCell>
                            <CTableDataCell>$5,000</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                            <CTableHeaderCell>Account Number</CTableHeaderCell>
                            <CTableDataCell>1234 5678 9012</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                            <CTableHeaderCell>Last Transaction</CTableHeaderCell>
                            <CTableDataCell>$250</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                            <CTableHeaderCell>Date Created</CTableHeaderCell>
                            <CTableDataCell>2024-01-01</CTableDataCell>
                        </CTableRow>
                        {/* Add more rows as needed */}
                    </CTable>
                </CCardBody>
            </CCard>
        </div>
    );
};

export default ViewWallet;
