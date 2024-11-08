// EditUser.js
import React from 'react';
import { CCard, CCardHeader, CCardBody, CCardTitle, CCardText, CButton, CForm, CFormLabel, CFormInput } from '@coreui/react';
import { useNavigate } from 'react-router-dom';

const EditUser = () => {
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
          <h5 className="mb-0">Edit User</h5>
          <CButton color="secondary" size="sm" onClick={handleBack}>Back</CButton>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <div className="mb-3">
              <CFormLabel htmlFor="name">Name</CFormLabel>
              <CFormInput type="text" id="name" placeholder="Enter name" required />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="email">Email</CFormLabel>
              <CFormInput type="email" id="email" placeholder="Enter email" required />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="username">Username</CFormLabel>
              <CFormInput type="text" id="username" placeholder="Enter username" required />
            </div>
            {/* Add additional form fields as needed */}
            <CButton type="submit" color="primary">Submit</CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default EditUser;
