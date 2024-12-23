import React, { useState, useEffect } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import api from '../../api/apiWrapper'
import SpinnerOverlay from '../../components/SpinnerOverlay';
import Pagination from '../../components/Pagination';


// async function onClick() {
//   const res = await api.get('/bills/vendors')
//   console.log('data is', res.data)
// }

const UserWallet = () => {

  const [userWallets, setUserWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);


  const fetchUserWallet = async (page = 1) => {
    try {
      setLoading(true); // Show spinner
      const response = await api.get(`/wallets?page=${page}`);
      console.log('data is', response.data);

      setUserWallets(response.data.data.wallets); // Set users
      setPagination(response.data.data.pagination); // Set pagination info
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  useEffect(() => {
    fetchUserWallet(currentPage); // Fetch users for the current page
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update current page state
  };


  return (
    <div>
      <SpinnerOverlay isLoading={loading} />

      {/* <div className="d-flex justify-content-end mb-3">
                <a href="/#/add-bill-type" className="btn btn-primary">Add Bill Type</a>
            </div> */}
      <CTable bordered>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">S.No</CTableHeaderCell>
            <CTableHeaderCell scope="col">User Name</CTableHeaderCell>
            {/* <CTableHeaderCell scope="col">Email</CTableHeaderCell> */}
            <CTableHeaderCell scope="col">Current Amount</CTableHeaderCell>
            <CTableHeaderCell scope="col">Overdrawn Amount</CTableHeaderCell>
            <CTableHeaderCell scope="col">Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {userWallets.map((userWallet, index) => (
            <CTableRow key={userWallet._id}>
              <CTableHeaderCell scope="row">
                {pagination.limit * (currentPage - 1) + index + 1}
              </CTableHeaderCell>
              <CTableDataCell>{userWallet.user?.first_name || 'No Name'}</CTableDataCell>
              {/* <CTableDataCell>{userWallet.user?.email || 'test@gmail.com'}</CTableDataCell> */}
              <CTableDataCell>{userWallet.balance ?? ''}</CTableDataCell>
              <CTableDataCell>{userWallet.overdrawn_balance ?? ''}</CTableDataCell>
              <CTableDataCell className="text-center">
                <a href={`/#/edit-wallet/${userWallet._id}`} className="me-2"><i className="bi bi-pencil-square"></i></a>
                <a href={`/#/view-wallet/${userWallet._id}`} className="text-secondary me-2">
                  <i class="bi bi-eye"></i>
                </a>
                <a href="#" class="text-danger">
                  <i class="bi bi-trash3-fill"></i>
                </a>
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
  )
}

export default UserWallet
