// EditUser.js
import React from 'react';
import { CCard, CCardHeader, CCardBody, CCardTitle, CCardText, CButton, CForm, CFormLabel, CFormInput, CFormSelect } from '@coreui/react';
import { useNavigate } from 'react-router-dom';

const AddVendor = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic here
    };

    return (
        <div className="container mt-5">
            <CCard>
                <CCardHeader className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Add Vendor</h5>
                    <CButton color="secondary" size="sm" onClick={handleBack}>Back</CButton>
                </CCardHeader>
                <CCardBody>
                    <CForm onSubmit={handleSubmit}>
                        {/* Vendor Name Field */}
                        <div className="mb-3">
                            <CFormLabel htmlFor="name">Vendor Name</CFormLabel>
                            <CFormInput type="text" id="name" placeholder="Enter name" required />
                        </div>

                        {/* Type Dropdown */}
                        <div className="mb-3">
                            <CFormLabel htmlFor="type">Type</CFormLabel>
                            <CFormSelect id="type" required>
                                <option value="">Select type</option>
                                <option value="wholesale">Wholesale</option>
                                <option value="retail">Retail</option>
                                <option value="supplier">Supplier</option>
                            </CFormSelect>
                        </div>

                        {/* File Upload */}
                        {/* <div className="mb-3">
                            <CFormLabel htmlFor="fileUpload">Upload Document</CFormLabel>
                            <CFormInput type="file" id="fileUpload" required />
                        </div> */}

                        {/* Submit Button */}
                        <CButton type="submit" color="primary">Submit</CButton>
                    </CForm>
                </CCardBody>
            </CCard>
        </div>
    );

};

export default AddVendor;
