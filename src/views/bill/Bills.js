// UserTable.js
import React from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';

const Bills = () => {
    var status = "Pending";
    return (
        <div>
            {/* <div className="d-flex justify-content-end mb-3">
                <a href="/#/add-bill" className="btn btn-primary">Add Category</a>
            </div> */}
            <CTable bordered>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col">S.No</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Account Number</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Providor Email</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Providor Website</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    <CTableRow>
                        <CTableHeaderCell scope="row">1</CTableHeaderCell>
                        <CTableDataCell>Mark</CTableDataCell>
                        <CTableDataCell>489958932</CTableDataCell>
                        <CTableDataCell>providor@gmail.com</CTableDataCell>
                        <CTableDataCell>website.com</CTableDataCell>
                        <CTableDataCell>
                            <span className={`badge ${status === 'Pending' ? 'bg-warning' : status === 'Approved' ? 'bg-success' : 'bg-secondary'}`}>
                                {status}
                            </span>
                        </CTableDataCell>
                        <CTableDataCell>
                            {/* <button className="btn btn-primary btn-sm me-2">Edit</button> */}
                            <a href="/#/edit-bill" className="btn btn-primary btn-sm me-2">Edit</a>

                            <button className="btn btn-danger btn-sm">Delete</button>
                        </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                        <CTableHeaderCell scope="row">1</CTableHeaderCell>
                        <CTableDataCell>Henry</CTableDataCell>
                        <CTableDataCell>489958932</CTableDataCell>
                        <CTableDataCell>providor@gmail.com</CTableDataCell>
                        <CTableDataCell>website.com</CTableDataCell>
                        <CTableDataCell>
                            <span className={`badge ${status === 'Pending' ? 'bg-warning' : status === 'Approved' ? 'bg-success' : 'bg-secondary'}`}>
                                {status}
                            </span>
                        </CTableDataCell>
                        <CTableDataCell>
                            {/* <button className="btn btn-primary btn-sm me-2">Edit</button> */}
                            <a href="/#/edit-bill" className="btn btn-primary btn-sm me-2">Edit</a>
                            <button className="btn btn-danger btn-sm">Delete</button>
                        </CTableDataCell>
                    </CTableRow>

                </CTableBody>
            </CTable>
        </div>
    );
};

export default Bills;
