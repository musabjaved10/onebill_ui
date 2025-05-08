import React, { useState, useEffect } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import SpinnerOverlay from '../../components/SpinnerOverlay'
import api from '../../api/apiWrapper'
import Pagination from '../../components/Pagination'
import ConfirmationModal from '../../components/ConfirmationModal'
import { toast, ToastContainer } from 'react-toastify'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({}) // Initialize as an empty object
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [selectedBillId, setSelectedBillId] = useState(null)

  // const fetchDashboardData = async () => {
  //   try {
  //     setLoading(true)
  //     const response = await api.get(`/stats/bills`)
  //     setDashboardData(response.data.data || {}) // Ensure data is an object
  //   } catch (err) {
  //     console.error('Error fetching dashboard data:', err)
  //     setError('Failed to load dashboard data. Please try again later.')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // Modify your fetch functions with better error handling
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/stats/bills`)

      // More robust data validation
      if (response?.data?.data) {
        setDashboardData(response.data.data)
      } else {
        setError('Invalid dashboard data format')
        console.error('Invalid response format:', response)
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err.response?.data?.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const fetchBillData = async (page = 1) => {
    try {
      setLoading(true)
      const response = await api.get(`/bills/accounts?status=pending&page=${page}`)

      // Validate response structure
      if (response?.data?.data) {
        setBills(response.data.data.accounts || [])
        setPagination(response.data.data.pagination || {})
      } else {
        setError('Invalid bill data format')
        console.error('Invalid response format:', response)
      }
    } catch (err) {
      console.error('Error fetching bill data:', err)
      setError(err.response?.data?.message || 'Failed to load bill data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log("Initializing dashboard...");
    fetchDashboardData().then(() => console.log("Dashboard data loaded"));
  }, []);

  useEffect(() => {
    fetchBillData(currentPage)
  }, [currentPage])

  if (loading) {
    return <SpinnerOverlay isLoading={loading} />
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        {error}
      </div>
    )
  }

  // Destructure data safely
  const {
    average_bill_amount = {},
    current_due_bills = {},
    overdue_bills = {},
    paid_bills = {},
    totalCategories = 'N/A',
    totalUsers = 'N/A',
    totalVendors = 'N/A',
  } = dashboardData

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleBillDelete = (billId) => {
    setSelectedBillId(billId)
    setShowModal(true)
  }

  const handleBillDeleteConfirm = async () => {
    if (!selectedBillId) return

    try {
      await api.delete(`/bills/accounts/${selectedBillId}`)
      toast.success('Bill deleted successfully!')
      setTimeout(() => {
        fetchBillData(currentPage)
      }, 3000)
    } catch (error) {
      console.error('Error deleting bill:', error)
      toast.error('Failed to delete bill!')
    } finally {
      setShowModal(false)
      setSelectedBillId(null)
    }
  }

  return (
    <div className="container mt-5">
      {/* Message Banner */}
      <div
        className="alert alert-info text-center py-3 rounded"
        style={{ backgroundColor: '#e3f2fd', color: '#0d47a1' }}
      >
        <strong>{'Welcome to the dashboard!'}</strong>
      </div>

      {/* Dashboard Cards */}
      <div className="row g-4">
        {/* Existing Cards */}
        <DashboardCard
          title="Average Bill (This Month)"
          value={
            <span className="dark-mode-black">
              {average_bill_amount.this_month?.toFixed(2) || 'N/A'}
            </span>
          }
          color="#e7f3ff"
          textColor="#1565c0"
          icon="fas fa-calendar-alt"
        />
        <DashboardCard
          title="Average Bill (This Year)"
          value={
            <span className="dark-mode-black">
              {average_bill_amount.this_year?.toFixed(2) || 'N/A'}
            </span>
          }
          color="#e7f3ff"
          textColor="#1565c0"
          icon="fas fa-calendar-check"
        />
        <DashboardCard
          title="Average Bill (Overall)"
          value={
            <span className="dark-mode-black">
              {average_bill_amount.overall?.toFixed(2) || 'N/A'}
            </span>
          }
          color="#e7f3ff"
          textColor="#1565c0"
          icon="fas fa-chart-line"
        />
        <DashboardCard
          title="Current Due Bills (Count)"
          value={<span className="dark-mode-black">{current_due_bills.total_count || 0}</span>}
          color="#fff7e6"
          textColor="#f57f17"
          icon="fas fa-file-invoice"
        />
        <DashboardCard
          title="Current Due Bills (Amount)"
          value={
            <span className="dark-mode-black">
              {current_due_bills.total_amount?.toFixed(2) || 'N/A'}
            </span>
          }
          color="#fff7e6"
          textColor="#f57f17"
          icon="fas fa-dollar-sign"
        />
        <DashboardCard
          title="Overdue Bills (Count)"
          value={<span className="dark-mode-black">{overdue_bills.total_count || 0}</span>}
          color="#ffe5e5"
          textColor="#b71c1c"
          icon="fas fa-exclamation-circle"
        />
        <DashboardCard
          title="Overdue Bills (Amount)"
          value={
            <span className="dark-mode-black">
              {overdue_bills.total_amount?.toFixed(2) || 'N/A'}
            </span>
          }
          color="#ffe5e5"
          textColor="#b71c1c"
          icon="fas fa-dollar-sign"
        />
        <DashboardCard
          title="Paid Bills (This Month)"
          value={
            <span className="dark-mode-black">
              {paid_bills.this_month?.total_amount?.toFixed(2) || 'N/A'}
            </span>
          }
          color="#e8f7e8"
          textColor="#2e7d32"
          icon="fas fa-check-circle"
        />
        <DashboardCard
          title="Paid Bills (This Year)"
          value={
            <span className="dark-mode-black">
              {paid_bills.this_year?.total_amount?.toFixed(2) || 'N/A'}
            </span>
          }
          color="#e8f7e8"
          textColor="#2e7d32"
          icon="fas fa-calendar-check"
        />

        {/* New Cards */}
        <DashboardCard
          title="Total Categories"
          value={<span className="dark-mode-black">{totalCategories}</span>}
          color="#f0f4ff" // Light blue
          textColor="#1a237e" // Dark blue
          icon="fas fa-layer-group"
        />
        <DashboardCard
          title="Total Users"
          value={<span className="dark-mode-black">{totalUsers}</span>}
          color="#fff3e0" // Light orange
          textColor="#e65100" // Dark orange
          icon="fas fa-users"
        />
        <DashboardCard
          title="Total Service Providors"
          value={<span className="dark-mode-black">{totalVendors}</span>}
          color="#fce4ec" // Light pink
          textColor="#880e4f" // Dark pink
          icon="fas fa-store"
        />
      </div>

      {/* Bills Table */}
      <div className="card shadow-sm mt-5 card-dark-mode">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Bills Overview</h4>
        </div>
        <CTable bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">S.No</CTableHeaderCell>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Account Number</CTableHeaderCell>
              <CTableHeaderCell scope="col">Provider Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Provider Email</CTableHeaderCell>
              <CTableHeaderCell scope="col">Provider Website</CTableHeaderCell>
              <CTableHeaderCell scope="col">Status</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {bills && bills.length > 0 ? (
              bills.map((bill, index) => (
                <CTableRow key={bill._id}>
                  <CTableHeaderCell scope="row">
                    {pagination.limit * (currentPage - 1) + index + 1}
                  </CTableHeaderCell>
                  <CTableDataCell>
                    {bill.first_name_on_bill + ' ' + bill.last_name_on_bill}
                  </CTableDataCell>
                  <CTableDataCell>{bill.account_number ?? ''}</CTableDataCell>
                  <CTableDataCell>{bill.service_provider_info.provider_name ?? ''}</CTableDataCell>
                  <CTableDataCell>{bill.service_provider_info.email ?? ''}</CTableDataCell>
                  <CTableDataCell>{bill.service_provider_info.website ?? ''}</CTableDataCell>
                  <CTableDataCell>
                    <span
                      className={`badge ${
                        bill.status === 'pending'
                          ? 'bg-warning'
                          : bill.status === 'approved'
                            ? 'bg-success'
                            : 'bg-secondary'
                      }`}
                    >
                      {bill.status}
                    </span>
                  </CTableDataCell>
                  <CTableDataCell>
                    <a href={`/#/edit-bill/${bill._id}`} className="btn btn-primary btn-sm me-2">
                      Edit
                    </a>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleBillDelete(bill._id)}
                    >
                      Delete
                    </button>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  No bills available.
                </td>
              </tr>
            )}
          </CTableBody>
        </CTable>
        <div className="card-footer text-end">
          <Pagination
            totalPages={pagination.totalPages || 1}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={handleBillDeleteConfirm}
        message="Do you really want to delete this bill?"
      />

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

// Reusable Card Component
const DashboardCard = ({ title, value, color, textColor, icon }) => (
  <div className="col-md-4">
    <div
      className="card border-0 shadow-sm h-100"
      style={{
        background: `linear-gradient(135deg, ${color}, #ffffff)`,
        borderRadius: '12px',
      }}
    >
      <div className="card-body d-flex align-items-center">
        <div className="me-3">
          <i className={`${icon} fa-2x`} style={{ color: textColor }}></i>
        </div>
        <div>
          <h6 className="fw-bold" style={{ color: textColor }}>
            {title}
          </h6>
          <h4 className="mb-0">{value}</h4>
        </div>
      </div>
    </div>
  </div>
)

export default Dashboard
