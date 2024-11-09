// UserTable.js
import React from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';

const UserWallet = () => {
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
                            <a href="/#/view-wallet" className="btn btn-primary btn-sm me-2">View Details</a>
                            {/* <button className="btn btn-danger btn-sm">Delete</button> */}
                        </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                        <CTableHeaderCell scope="row">2</CTableHeaderCell>
                        <CTableDataCell>Wick</CTableDataCell>
                        <CTableDataCell>wick@gmail.com</CTableDataCell>
                        <CTableDataCell>250$</CTableDataCell>
                        <CTableDataCell>
                            <a href="/#/view-wallet" className="btn btn-primary btn-sm me-2">View Details</a>
                        </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                        <CTableHeaderCell scope="row">3</CTableHeaderCell>
                        <CTableDataCell>Sam</CTableDataCell>
                        <CTableDataCell>sam@gmail.com</CTableDataCell>
                        <CTableDataCell>175$</CTableDataCell>
                        <CTableDataCell>
                            <a href="/#/view-wallet" className="btn btn-primary btn-sm me-2">View Details</a>
                        </CTableDataCell>
                    </CTableRow>
                </CTableBody>
            </CTable>
        </div>
    );
};

export default UserWallet;
