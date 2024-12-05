import React, { useState, useEffect } from 'react';
import { CCard, CCardHeader, CCardBody, CCardTitle, CCardText, CButton, CForm, CFormLabel, CFormInput, CFormSelect } from '@coreui/react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/apiWrapper';
import SpinnerOverlay from '../../components/SpinnerOverlay';

const EditBill = () => {

    const { id } = useParams(); // Get category ID from route

    const [billData, setBillData] = useState({
        account_number: '',
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        email: '',
        status: '',
        provider_email: '',
        provider_website: '',
        provider_name: '',
        provider_number: '',
        provider_website: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/bills/accounts/${id}`);
                console.log(response.data.data)
                setBillData({
                    account_number: response.data.data.account_number ?? '',
                    first_name: response.data.data.first_name_on_bill ?? '',
                    last_name: response.data.data.last_name_on_bill ?? '',
                    username: response.data.data.user_credentials.username ?? '',
                    email: response.data.data.user_credentials.email ?? '',
                    // status: response.data.data.status === 'approved',
                    status: response.data.data.status === 'approved' ? 'approved' : 'pending',
                    provider_email: response.data.data.service_provider_info.email ?? '',
                    provider_website: response.data.data.service_provider_info.website ?? '',
                    provider_name: response.data.data.service_provider_info.provider_name ?? '',
                    provider_number: response.data.data.service_provider_info.phone_number ?? '',
                });
                setLoading(false);
            } catch (err) {
                setError('Failed to load category data.');
                setLoading(false);
            }
        };
        fetchCategoryData();
    }, [id]);


    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent form submission reload

        try {
            setLoading(true); // Show loading spinner while processing
            const response = await api.put(`/bills/accounts/${id}`, { status: billData.status });

            if (response.status === 200) {
                setSuccess('Status updated successfully!');
            } else {
                setError('Failed to update the status. Please try again.');
            }
        } catch (err) {
            console.error('Error updating status:', err);
            setError('Failed to update the status. Please try again.');
        } finally {
            setLoading(false);
            setTimeout(() => {
                navigate('/bills');
            }, 2000);
        }
    };



    const handleStatusChange = (e) => {
        const { value } = e.target;
        setBillData((prevState) => ({
            ...prevState,
            status: value,
        }));
    };


    return (
        <div className="container mt-5">
            <SpinnerOverlay isLoading={loading} />
            <CCard>
                <CCardHeader className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Edit Bill</h5>
                    <CButton color="secondary" size="sm" onClick={handleBack}>Back</CButton>
                </CCardHeader>
                <CCardBody>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <CForm onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="name">User Name</CFormLabel>
                            <CFormInput type="text" id="username" value={billData.username} required />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="name">Name</CFormLabel>
                            <CFormInput type="text" id="name" value={billData.first_name + " " + billData.last_name} required />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="email">User Email</CFormLabel>
                            <CFormInput type="text" id="email" value={billData.email} required />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="account_numbber">Account Number</CFormLabel>
                            <CFormInput type="text" id="account_numbber" value={billData.account_number} required />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="vendor_name">Vendor Name</CFormLabel>
                            <CFormInput type="text" id="vendor_name" value={billData.provider_name} required />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="vendor_email">Vendor Email</CFormLabel>
                            <CFormInput type="text" id="vendor_email" value={billData.provider_email} required />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="vendor_number">Vendor Phone Number</CFormLabel>
                            <CFormInput type="text" id="vendor_number" value={billData.provider_number} required />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="vendor_website">Vendor Website</CFormLabel>
                            <CFormInput type="text" id="vendor_website" value={billData.provider_website} required />
                        </div>

                        {/* <div className="mb-3">
                            <CFormLabel htmlFor="type">Link to Vendor</CFormLabel>
                            <CFormSelect id="type" required>
                                <option value="k-e" selected>K-Electric</option>
                                <option value="water">Water</option>
                                <option value="gas">Gas</option>
                            </CFormSelect>
                        </div> */}

                        <div className="mb-3">
                            <CFormLabel htmlFor="type">Type</CFormLabel>
                            <CFormSelect
                                id="status"
                                value={billData.status}
                                onChange={handleStatusChange}
                            >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                            </CFormSelect>
                        </div>
                        <CButton type="submit" color="primary">Submit</CButton>
                    </CForm>
                </CCardBody>
            </CCard>
        </div>
    );

};

export default EditBill;
