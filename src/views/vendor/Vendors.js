// UserTable.js
import React from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';

const Vendors = () => {
    return (
        <div>
            <div className="d-flex justify-content-end mb-3">
                <a href="/#/add-vendor" className="btn btn-primary">Add Vendor</a>
            </div>
            <CTable bordered>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col">S.No</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Vendor Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    <CTableRow>
                        <CTableHeaderCell scope="row">1</CTableHeaderCell>
                        <CTableDataCell>Vendor 1</CTableDataCell>
                        <CTableDataCell>K-Electric</CTableDataCell>
                        <CTableDataCell>
                            {/* <button className="btn btn-primary btn-sm me-2">Edit</button> */}
                            <a href="/#/edit-vendor" className="btn btn-primary btn-sm me-2">Edit</a>
                            <button className="btn btn-danger btn-sm">Delete</button>
                        </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                        <CTableHeaderCell scope="row">2</CTableHeaderCell>
                        <CTableDataCell>Vendor 2</CTableDataCell>
                        <CTableDataCell>Wapda</CTableDataCell>
                        <CTableDataCell>
                            <a href="/#/edit-vendor" className="btn btn-primary btn-sm me-2">Edit</a>
                            <button className="btn btn-danger btn-sm">Delete</button>
                        </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                        <CTableHeaderCell scope="row">3</CTableHeaderCell>
                        <CTableDataCell>Vendor 3</CTableDataCell>
                        <CTableDataCell>Water</CTableDataCell>
                        <CTableDataCell>
                            <a href="/#/edit-vendor" className="btn btn-primary btn-sm me-2">Edit</a>
                            <button className="btn btn-danger btn-sm">Delete</button>
                        </CTableDataCell>
                    </CTableRow>
                </CTableBody>
            </CTable>
        </div>
    );
};

export default Vendors;
