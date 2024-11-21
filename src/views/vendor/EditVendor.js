
import React, { useState, useEffect } from 'react';
import { CCard, CCardHeader, CCardBody, CCardTitle, CCardText, CButton, CForm, CFormLabel, CFormInput, CFormSelect } from '@coreui/react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/apiWrapper';
import SpinnerOverlay from '../../components/SpinnerOverlay';

const EditVendor = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [vendorData, setVendorData] = useState({
        provider_name: '',
        bill_category: ''
    });
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchCategories = async (page = 1) => {
        try {
            setLoading(true); // Show spinner
            const response = await api.get(`/bills/categories`);
            console.log('data is', response.data);

            setCategories(response.data.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        const fetchVendorData = async () => {
            // console.log('in function');
            try {
                setLoading(true);
                const response = await api.get(`/bills/vendors/${id}`);
                console.log("SIngle VENDOR DATA: ", response)
                setVendorData({
                    provider_name: response.data.data.provider_name ?? "",
                    bill_id: response.data.data.bill_category._id ?? "",

                });
                setLoading(false);
            } catch (err) {
                setError('Failed to load category data.');
                setLoading(false);
            } finally {
                setLoading(false); // Hide spinner
            }
        };
        fetchVendorData();
        fetchCategories();

    }, [id]);

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic here
    };

    return (
        <div className="container mt-5">
            <SpinnerOverlay isLoading={loading} />
            <CCard>
                <CCardHeader className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Edit Vendor</h5>
                    <CButton color="secondary" size="sm" onClick={handleBack}>Back</CButton>
                </CCardHeader>
                <CCardBody>
                    <CForm onSubmit={handleSubmit}>
                        {/* Vendor Name Field */}
                        <div className="mb-3">
                            <CFormLabel htmlFor="name">Vendor Name</CFormLabel>
                            <CFormInput type="text" id="name" placeholder="Vendor name" value={vendorData.provider_name} required />
                        </div>

                        {/* Type Dropdown */}
                        <div className="mb-3">
                            <CFormLabel htmlFor="type">Type</CFormLabel>
                            <CFormSelect id="type" required value={vendorData.bill_id} >
                                <option value="">Select type</option>
                                {categories.map((category, index) => (
                                    <option key={category._id} value={category._id}
                                    >{category.name}</option>
                                ))}
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

export default EditVendor;
