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
        bill_id: ''
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const fetchCategories = async () => {
        try {
            setLoading(true); // Show spinner
            const response = await api.get(`/bills/categories`);
            setCategories(response.data.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchVendorData = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/bills/vendors/${id}`);
            setVendorData({
                provider_name: response.data.data.provider_name ?? "",
                bill_id: response.data.data.bill_category?._id ?? ""
            });

        } catch (err) {
            setError('Failed to load vendor data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendorData();
        fetchCategories();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVendorData((prev) => ({ ...prev, [name]: value }));
    };

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            const response = await api.put(`/bills/vendors/${id}`, {
                provider_name: vendorData.provider_name,
                bill_category: vendorData.bill_id
            });
            // alert('Vendor updated successfully!');
            setSuccess('Vendor updated successfully!');
            setTimeout(() => {
                navigate('/vendors');
            }, 2000);

            // navigate(-1); // Redirect to the previous page
        } catch (error) {
            // console.error('Error updating vendor:', error);
            setError('Failed to update vendor.');
        } finally {
            setLoading(false);
        }
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
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <CForm onSubmit={handleSubmit}>
                        {/* Vendor Name Field */}
                        <div className="mb-3">
                            <CFormLabel htmlFor="name">Vendor Name</CFormLabel>
                            <CFormInput
                                type="text"
                                id="name"
                                name="provider_name"
                                placeholder="Vendor name"
                                value={vendorData.provider_name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Type Dropdown */}
                        <div className="mb-3">
                            <CFormLabel htmlFor="type">Type</CFormLabel>
                            <CFormSelect
                                id="type"
                                name="bill_id"
                                value={vendorData.bill_id}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select type</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
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

export default EditVendor;
