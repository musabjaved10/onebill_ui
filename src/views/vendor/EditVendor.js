import React, { useState, useEffect } from 'react';
import { CCard, CCardHeader, CCardBody, CCardTitle, CCardText, CButton, CForm, CFormLabel, CFormInput, CFormSelect, CInputGroup, CInputGroupText } from '@coreui/react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/apiWrapper';
import SpinnerOverlay from '../../components/SpinnerOverlay';

const EditVendor = () => {
    // console.log('hello');
    // exit()
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
            console.log(response)
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
            setLoading(true); // Start loading state

            const imageFile = document.querySelector('#vendor-image').files[0];
            let uploadedImageUrl = null;

            console.log('Selected Image File:', imageFile);

            // Check if an image file is uploaded
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);

                console.log('Uploading image...');
                // Upload image to the /upload-image API
                const uploadResponse = await api.post('/media/upload-image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log('Upload response:', uploadResponse);

                if (uploadResponse.status === 200) {
                    uploadedImageUrl = uploadResponse.data.imageUrl; // Assuming API returns image URL
                    console.log('Image uploaded successfully:', uploadedImageUrl);
                } else {
                    console.error('Image upload failed, response status:', uploadResponse.status);
                    setError('Image upload failed.');
                    return; // Stop further execution
                }
            } else {
                console.warn('No image file selected.');
            }

            const vendorUpdateData = {
                provider_name: vendorData.provider_name,
                bill_category: vendorData.bill_id,
            };

            if (uploadedImageUrl) {
                vendorUpdateData.image = uploadedImageUrl;
            }

            console.log('Updating vendor data:', vendorUpdateData);
            const response = await api.put(`/bills/vendors/${id}`, vendorUpdateData);

            if (response.status === 200) {
                console.log('Vendor updated successfully:', response.data);
                setSuccess('Vendor updated successfully!');
                setTimeout(() => {
                    navigate('/vendors');
                }, 2000);
            } else {
                console.error('Vendor update failed, response status:', response.status);
                setError('Failed to update vendor.');
            }
        } catch (error) {
            console.error('Error during vendor update process:', error);
            setError('Failed to update vendor.');
        } finally {
            setLoading(false); // End loading state
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
                        <div className='mb-3'>
                            <CFormLabel htmlFor="type">File</CFormLabel>
                            <CFormInput type="file" id="vendor-image" name='vendor-image' />
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
