// EditUser.js
import React from 'react';
import { CCard, CCardHeader, CCardBody, CButton, CForm, CFormLabel, CFormInput } from '@coreui/react';
import { useNavigate } from 'react-router-dom';

const AddBillType = () => {
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
                    <h5 className="mb-0">Add Category</h5>
                    <CButton color="secondary" size="sm" onClick={handleBack}>Back</CButton>
                </CCardHeader>
                <CCardBody>
                    <CForm onSubmit={handleSubmit}>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="bill_type">Type</CFormLabel>
                            <CFormInput type="bill_type" id="bill_type" placeholder="Enter type" required />
                        </div>
                        <CButton type="submit" color="primary">Submit</CButton>
                    </CForm>
                </CCardBody>
            </CCard>
        </div>
    );
};

export default AddBillType;
