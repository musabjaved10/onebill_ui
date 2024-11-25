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

      setUserWallets(response.data.data.accounts); // Set users
      // setPagination(response.data.data.pagination); // Set pagination info
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
      {/* <div className="d-flex justify-content-end mb-3">
                <a href="/#/add-bill-type" className="btn btn-primary">Add Bill Type</a>
            </div> */}
      <CTable bordered>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">S.No</CTableHeaderCell>
            <CTableHeaderCell scope="col">User Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Email</CTableHeaderCell>
            <CTableHeaderCell scope="col">Current Amount</CTableHeaderCell>
            <CTableHeaderCell scope="col">Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow>
            <CTableHeaderCell scope="row">1</CTableHeaderCell>
            <CTableDataCell>John</CTableDataCell>
            <CTableDataCell>john@gmail.com</CTableDataCell>
            <CTableDataCell>300$</CTableDataCell>
            <CTableDataCell>
              {/* <button className="btn btn-primary btn-sm me-2">Edit</button> */}
              <a href="/#/view-wallet" className="btn btn-primary btn-sm me-2">
                View Details
              </a>
              {/* <button className="btn btn-danger btn-sm">Delete</button> */}
            </CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">2</CTableHeaderCell>
            <CTableDataCell>Wick</CTableDataCell>
            <CTableDataCell>wick@gmail.com</CTableDataCell>
            <CTableDataCell>250$</CTableDataCell>
            <CTableDataCell>
              <a href="/#/view-wallet" className="btn btn-primary btn-sm me-2">
                View Details
              </a>
            </CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">3</CTableHeaderCell>
            <CTableDataCell>Sam</CTableDataCell>
            <CTableDataCell>sam@gmail.com</CTableDataCell>
            <CTableDataCell>175$</CTableDataCell>
            <CTableDataCell>
              <a href="/#/view-wallet" className="btn btn-primary btn-sm me-2">
                View Details
              </a>
              <button onClick={() => onClick()}>Make call</button>
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
    </div>
  )
}

export default UserWallet
