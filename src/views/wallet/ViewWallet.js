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
} from '@coreui/react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/apiWrapper';
import SpinnerOverlay from '../../components/SpinnerOverlay';

const ViewWallet = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [wallet, setWallet] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchWallet = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/wallets/${id}`);
            setWallet(response.data.data);

            const summary = await api.get(`/wallets/${id}/transactions`);
            setTransactions(summary.data.data.transactions);
        } catch (err) {
            setError('Failed to load wallet data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallet();
    }, [id]);

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    return (
        <div className="wallet-container">
            <SpinnerOverlay isLoading={loading} />

            {/* Wallet Details Card */}
            <CCard className="wallet-card">
                <CCardHeader className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 text-dark">Wallet Details</h5>
                    <CButton color="secondary" size="sm" onClick={handleBack}>
                        Back
                    </CButton>
                </CCardHeader>
                <CCardBody>
                    <CTable borderless hover responsive className="wallet-table text-dark">
                        <CTableRow>
                            <CTableHeaderCell>User Name</CTableHeaderCell>
                            <CTableDataCell>{`${wallet.user?.first_name || ''} ${wallet.user?.last_name || ''}`}</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                            <CTableHeaderCell>Balance</CTableHeaderCell>
                            <CTableDataCell>{wallet.balance ?? 0}</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                            <CTableHeaderCell>Account Number</CTableHeaderCell>
                            <CTableDataCell>1234 5678 9012</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                            <CTableHeaderCell>Overdrawn Balance</CTableHeaderCell>
                            <CTableDataCell>{wallet.overdrawn_balance ?? 0}</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                            <CTableHeaderCell>Date Created</CTableHeaderCell>
                            <CTableDataCell>{formatDate(wallet.createdAt)}</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                            <CTableHeaderCell>Last Updated</CTableHeaderCell>
                            <CTableDataCell>{formatDate(wallet.last_updated)}</CTableDataCell>
                        </CTableRow>
                    </CTable>
                </CCardBody>
            </CCard>

            {/* Transaction Summary Card */}
            <CCard className="mt-4">
                <CCardHeader>
                    <h5 className="mb-0 text-dark">Transaction Summary</h5>
                </CCardHeader>
                <CCardBody>
                    <CTable striped hover responsive className="transaction-table">
                        <thead>
                            <CTableRow>
                                <CTableHeaderCell>Amount</CTableHeaderCell>
                                <CTableHeaderCell>Transaction Type</CTableHeaderCell>
                                <CTableHeaderCell>Status</CTableHeaderCell>
                                <CTableHeaderCell>Date</CTableHeaderCell>
                            </CTableRow>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <CTableRow key={transaction._id}>
                                    <CTableDataCell>${transaction.amount}</CTableDataCell>
                                    <CTableDataCell>{transaction.transaction_type}</CTableDataCell>
                                    <CTableDataCell>{transaction.status}</CTableDataCell>
                                    <CTableDataCell>{formatDate(transaction.createdAt)}</CTableDataCell>
                                </CTableRow>
                            ))}
                        </tbody>
                    </CTable>
                </CCardBody>
            </CCard>
        </div>
    );
};

export default ViewWallet;