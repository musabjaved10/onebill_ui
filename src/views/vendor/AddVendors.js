import React, { useState } from 'react';
import { CCard, CCardHeader, CCardBody, CCardTitle, CCardText, CButton, CForm, CFormLabel, CFormInput, CFormSelect } from '@coreui/react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import api from '../../api/apiWrapper';


const AddVendor = () => {
    const navigate = useNavigate();

    // State to manage form data
    const [vendorData, setVendorData] = useState({
        provider_name: '',
        bill_category: '',
    });

    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');


    // Handle input change
    const handleChange = (e) => {
        const { id, value } = e.target;
        setVendorData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await api.post('/bills/vendors', vendorData);
            // Handle success (e.g., show a success message or navigate)
            setSuccess('Vendor created successfully!');
            setTimeout(() => {
                navigate('/vendors'); 
              }, 2000);

            // navigate('/vendors'); // Redirect after successful creation
        } catch (error) {
            // Handle error
            // console.error('Error creating vendor:', error);
            setError('Failed to update vandor.');

        }
    };

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <div className="container mt-5">
            <CCard>
                <CCardHeader className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Add Vendor</h5>
                    <CButton color="secondary" size="sm" onClick={handleBack}>Back</CButton>
                </CCardHeader>
                <CCardBody>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <CForm onSubmit={handleSubmit}>
                        {/* Vendor Name Field */}
                        <div className="mb-3">
                            <CFormLabel htmlFor="provider_name">Vendor Name</CFormLabel>
                            <CFormInput
                                type="text"
                                id="provider_name"
                                placeholder="Enter name"
                                value={vendorData.provider_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Bill Category Dropdown */}
                        <div className="mb-3">
                            <CFormLabel htmlFor="bill_category">Bill Category</CFormLabel>
                            <CFormSelect
                                id="bill_category"
                                value={vendorData.bill_category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select category</option>
                                <option value="671a300475f8ba0fc198fd2c">Electricity</option>
                                <option value="671a305675f8ba0fc198fd33">Gas</option>
                                {/* Add more options as needed */}
                            </CFormSelect>
                        </div>

                        {/* Submit Button */}
                        <CButton type="submit" color="primary">Submit</CButton>
                    </CForm>
                </CCardBody>
            </CCard>
        </div>
    );
};

export default AddVendor;
