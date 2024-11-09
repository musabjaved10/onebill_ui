// EditUser.js
import React from 'react';
import { CCard, CCardHeader, CCardBody, CCardTitle, CCardText, CButton, CForm, CFormLabel, CFormInput, CFormSelect } from '@coreui/react';
import { useNavigate } from 'react-router-dom';

const EditBill = () => {
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
                    <h5 className="mb-0">Edit Bill</h5>
                    <CButton color="secondary" size="sm" onClick={handleBack}>Back</CButton>
                </CCardHeader>
                <CCardBody>
                    <CForm onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="name">User Name</CFormLabel>
                            <CFormInput type="text" id="name" placeholder="Enter name" required />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="email">User Email</CFormLabel>
                            <CFormInput type="text" id="email" placeholder="Enter email" required />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="vendor_name">Vendor Name</CFormLabel>
                            <CFormInput type="text" id="vendor_name" placeholder="Enter name" required />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="vendor_email">Vendor Email</CFormLabel>
                            <CFormInput type="text" id="vendor_email" placeholder="Enter email" required />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="vendor_website">Vendor Website</CFormLabel>
                            <CFormInput type="text" id="vendor_website" placeholder="Enter website" required />
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="type">Link to Vendor</CFormLabel>
                            <CFormSelect id="type" required>
                                <option value="k-e" selected>K-Electric</option>
                                <option value="water">Water</option>
                                <option value="gas">Gas</option>
                            </CFormSelect>
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="type">Type</CFormLabel>
                            <CFormSelect id="type" required>
                                <option value="pending" selected>Pending</option>
                                <option value="approved">Approved</option>
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

export default EditBill;
