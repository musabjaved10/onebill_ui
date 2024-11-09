import React from 'react';
import { CCard, CCardBody, CCardHeader, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton } from '@coreui/react';
import { useNavigate } from 'react-router-dom';

const ViewWallet = () => {

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    const walletDetails = [
        { label: 'Balance', value: '$5,000' },
        { label: 'Account Number', value: '1234 5678 9012' },
        { label: 'Last Transaction', value: '$250' },
        { label: 'Date Created', value: '2024-01-01' },
        // Add more details as needed
    ];

    return (
        <div className="wallet-container">
            <CCard className="wallet-card">
                <CCardHeader className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Wallet Details</h5>
                    <CButton color="secondary" size="sm" onClick={handleBack}>Back</CButton>
                </CCardHeader>
                <CCardBody>
                    <CTable borderless hover responsive className="wallet-table">
                        <CTableBody>
                            {walletDetails.map((detail, index) => (
                                <CTableRow key={index}>
                                    <CTableHeaderCell>{detail.label}</CTableHeaderCell>
                                    <CTableDataCell>{detail.value}</CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>
        </div>
    );
}

export default ViewWallet;
