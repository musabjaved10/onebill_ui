import React, { useState, useEffect } from 'react';
import {
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
} from '@coreui/react';

import SpinnerOverlay from '../../components/SpinnerOverlay';
import Pagination from '../../components/Pagination';
import api from '../../api/apiWrapper';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    const fetchUsers = async (page = 1) => {
        try {
            setLoading(true); // Show spinner
            const response = await api.get(`/users?page=${page}`);
            console.log('data is', response.data);

            setUsers(response.data.data.users); // Set users
            setPagination(response.data.data.pagination); // Set pagination info
        } catch (error) {
            console.error('Error fetching users:', error);
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

    return (
        <div>
            <SpinnerOverlay isLoading={loading} />
            <CTable bordered>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col">S.No</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Phone</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Stauts</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {users.map((user, index) => (
                        <CTableRow key={user._id}>
                            <CTableHeaderCell scope="row">
                                {pagination.limit * (currentPage - 1) + index + 1}
                            </CTableHeaderCell>
                            <CTableDataCell>{user.first_name + ' ' + user.last_name}</CTableDataCell>
                            <CTableDataCell>{user.email}</CTableDataCell>
                            <CTableDataCell>{user.phone_number || 'N/A'}</CTableDataCell>
                            <CTableDataCell>
                                <span className={`badge ${user.is_verified == false ? 'bg-warning' : user.is_verified == true ? 'bg-success' : 'bg-secondary'}`}>
                                    {user.is_verified === true ? 'Approved' : 'Pending'}
                                </span>
                            </CTableDataCell>
                            <CTableDataCell>
                                <a href={`/#/edit-user/${user._id}`} className="btn btn-primary btn-sm me-2">
                                    Edit
                                </a>
                                <button className="btn btn-danger btn-sm">Delete</button>
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
    );
};

export default AllUsers;



