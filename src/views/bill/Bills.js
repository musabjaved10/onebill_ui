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
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import SpinnerOverlay from '../../components/SpinnerOverlay';
import Pagination from '../../components/Pagination';
import api from '../../api/apiWrapper';
import ConfirmationModal from '../../components/ConfirmationModal'; // Adjust the path as per your project structure

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [showModal, setShowModal] = useState(false);
  const [selectedBillId, setSelectedBillId] = useState(null);

  const fetchBills = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/bills/accounts?page=${page}`);
      console.log('data is', response.data);

      // Sort the data by createdAt in descending order
      const billsData = response.data.data.accounts
        .map((bill) => ({
          ...bill,
          bill_category: bill.bill_category ?? { name: 'N/A' },
          service_provider_info: bill.service_provider_info ?? { provider_name: 'N/A', email: 'N/A' },
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by createdAt in descending order

      setBills(billsData);
      setFilteredBills(billsData);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching bills:', error);
      toast.error('Failed to fetch bills!'); // Show error toast
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

    const filtered = bills.filter(
      (bill) =>
        bill.first_name_on_bill?.toLowerCase().includes(value) ||
        bill.last_name_on_bill?.toLowerCase().includes(value) ||
        bill.account_number?.toLowerCase().includes(value) ||
        bill.service_provider_info?.provider_name?.toLowerCase().includes(value) ||
        bill.service_provider_info?.email?.toLowerCase().includes(value) ||
        bill.status?.toLowerCase().includes(value) ||
        bill.bill_category?.name?.toLowerCase().includes(value)
    );

    setFilteredBills(filtered);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedData = [...filteredBills].sort((a, b) => {
      const aValue = key.includes('.') ? key.split('.').reduce((obj, key) => obj?.[key], a) : a[key];
      const bValue = key.includes('.') ? key.split('.').reduce((obj, key) => obj?.[key], b) : b[key];

      // Handle null or undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return direction === 'asc' ? 1 : -1;
      if (bValue == null) return direction === 'asc' ? -1 : 1;

      // Handle date comparison for createdAt
      if (key === 'createdAt') {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      }

      // Handle string/number comparison for other fields
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredBills(sortedData);
    setSortConfig({ key, direction });
  };

  const handleDeleteClick = (billId) => {
    setSelectedBillId(billId); // Set the selected bill ID
    setShowModal(true); // Show the confirmation modal
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBillId) return;

    try {
      await api.delete(`/bills/accounts/${selectedBillId}`); // Delete the bill
      toast.success('Bill deleted successfully!'); // Show success toast
      fetchBills(currentPage); // Refresh the bill list
    } catch (error) {
      console.error('Error deleting bill:', error);
      toast.error('Failed to delete bill!'); // Show error toast
    } finally {
      setShowModal(false); // Hide the modal
      setSelectedBillId(null); // Reset the selected bill ID
    }
  };

  return (
    <div>
      <SpinnerOverlay isLoading={loading} />

      {/* Search Bar */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search bills..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <CTable bordered>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">S.No</CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('first_name_on_bill')}>
              Name {sortConfig.key === 'first_name_on_bill' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('account_number')}>
              Account Number {sortConfig.key === 'account_number' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('service_provider_info.provider_name')}>
              Provider Name {sortConfig.key === 'service_provider_info.provider_name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('service_provider_info.email')}>
              Provider Email {sortConfig.key === 'service_provider_info.email' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('bill_category.name')}>
              Service Category {sortConfig.key === 'bill_category.name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('status')}>
              Status {sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('createdAt')}>
              Created At {sortConfig.key === 'createdAt' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredBills.map((bill, index) => {
            const billCategoryName = bill.bill_category?.name ?? 'N/A';
            const providerName = bill.service_provider_info?.provider_name ?? 'N/A';
            const providerEmail = bill.service_provider_info?.email ?? 'N/A';
            const createdAt = new Date(bill.createdAt).toLocaleString(); // Format createdAt

            return (
              <CTableRow key={bill._id}>
                <CTableHeaderCell scope="row">
                  {pagination.limit * (currentPage - 1) + index + 1}
                </CTableHeaderCell>
                <CTableDataCell>{bill.first_name_on_bill + ' ' + bill.last_name_on_bill}</CTableDataCell>
                <CTableDataCell>{bill.account_number ?? 'N/A'}</CTableDataCell>
                <CTableDataCell>{providerName}</CTableDataCell>
                <CTableDataCell>{providerEmail}</CTableDataCell>
                <CTableDataCell>{billCategoryName}</CTableDataCell>
                <CTableDataCell>
                  <span
                    className={`badge ${bill.status === 'pending'
                      ? 'bg-warning'
                      : bill.status === 'approved'
                      ? 'bg-success'
                      : 'bg-secondary'
                    }`}
                  >
                    {bill.status}
                  </span>
                </CTableDataCell>
                <CTableDataCell>{createdAt}</CTableDataCell> {/* Display formatted createdAt */}
                <CTableDataCell>
                  <a href={`/#/edit-bill/${bill._id}`} className="btn btn-primary btn-sm me-2">
                    Edit
                  </a>
                  <CButton color="danger" size="sm" onClick={() => handleDeleteClick(bill._id)}>
                    Delete
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            );
          })}
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
        message="Do you really want to delete this bill?"
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
