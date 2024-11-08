// UserTable.js
import React from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';

const Categories = () => {
    return (
        <div>
            <div className="d-flex justify-content-end mb-3">
                <a href="/#/add-category" className="btn btn-primary">Add Category</a>
            </div>
            <CTable bordered>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col">S.No</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Category Name</CTableHeaderCell>
                      
                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    <CTableRow>
                        <CTableHeaderCell scope="row">1</CTableHeaderCell>
                        <CTableDataCell>Mark</CTableDataCell>
                        <CTableDataCell>
                            {/* <button className="btn btn-primary btn-sm me-2">Edit</button> */}
                            <a href="/#/edit-category" className="btn btn-primary btn-sm me-2">Edit</a>
                            <button className="btn btn-danger btn-sm">Delete</button>
                        </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                        <CTableHeaderCell scope="row">2</CTableHeaderCell>
                        <CTableDataCell>@fat</CTableDataCell>
                        <CTableDataCell>
                            <button className="btn btn-primary btn-sm me-2">Edit</button>
                            <button className="btn btn-danger btn-sm">Delete</button>
                        </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                        <CTableHeaderCell scope="row">3</CTableHeaderCell>
                        <CTableDataCell>@twitter</CTableDataCell>
                        <CTableDataCell>
                            <button className="btn btn-primary btn-sm me-2">Edit</button>
                            <button className="btn btn-danger btn-sm">Delete</button>
                        </CTableDataCell>
                    </CTableRow>
                </CTableBody>
            </CTable>
        </div>
    );
};

export default Categories;
