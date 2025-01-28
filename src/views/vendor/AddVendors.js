import React, { useEffect, useState } from 'react';
import { CCard, CCardHeader, CCardBody, CCardTitle, CCardText, CButton, CForm, CFormLabel, CFormInput, CFormSelect } from '@coreui/react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import api from '../../api/apiWrapper';
import SpinnerOverlay from '../../components/SpinnerOverlay';


const AddVendor = () => {
    const navigate = useNavigate();

    // State to manage form data
    const [vendorData, setVendorData] = useState({
        provider_name: '',
        bill_category: '',
        vendor_url: '',
    });

    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);


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

     useEffect(() => {
            fetchCategories();
        }, []);


    // Handle input change
    const handleChange = (e) => {
        const { id, value } = e.target;
        setVendorData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    // setLoading(false); // End loading state

    // Handle form submission
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

            if (uploadedImageUrl) {
                vendorData.image = uploadedImageUrl;
            }

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

        } finally {
            setLoading(false); // End loading state
        }
    };

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <div className="container mt-5">
            <SpinnerOverlay isLoading={loading} />

            <CCard className='card-dark-mode'>
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
                                {/* <option value="671a300475f8ba0fc198fd2c">Electricity</option>
                                <option value="671a305675f8ba0fc198fd33">Gas</option> */}
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                                {/* Add more options as needed */}
                            </CFormSelect>
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="vendor_url">Vendor Url</CFormLabel>
                            <CFormInput
                                type="text"
                                id="vendor_url"
                                placeholder="Enter web url"
                                value={vendorData.vendor_url}
                                onChange={handleChange}
                                // required
                            />
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

export default AddVendor;
