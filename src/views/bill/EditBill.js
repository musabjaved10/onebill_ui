// import React, { useState, useEffect } from 'react';
// import { CCard, CCardHeader, CCardBody, CCardTitle, CCardText, CButton, CForm, CFormLabel, CFormInput, CFormSelect } from '@coreui/react';
// import { useNavigate, useParams } from 'react-router-dom';
// import api from '../../api/apiWrapper';
// import SpinnerOverlay from '../../components/SpinnerOverlay';

// const EditBill = () => {

//     const { id } = useParams(); // Get category ID from route

//     const [billData, setBillData] = useState({
//         account_number: '',
//         first_name: '',
//         last_name: '',
//         username: '',
//         email: '',
//         email: '',
//         status: '',
//         provider_email: '',
//         provider_website: '',
//         provider_name: '',
//         provider_number: '',
//         provider_website: '',
//     });
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');

//     const [vendors, setVendors] = useState([]);
//     const [selectedVendor, setSelectedVendor] = useState('');

//     useEffect(() => {
//         const fetchCategoryData = async () => {
//             try {
//                 setLoading(true);
//                 const response = await api.get(`/bills/accounts/${id}`);

//                 const res = await api.get(`/bills/vendors`);
//                 // console.log('response: ', res.data.data.vendors)
//                 setVendors(res.data.data.vendors);


//                 // console.log(response.data.data)
//                 setBillData({
//                     account_number: response.data.data.account_number ?? '',
//                     first_name: response.data.data.first_name_on_bill ?? '',
//                     last_name: response.data.data.last_name_on_bill ?? '',
//                     username: response.data.data.user_credentials.username ?? '',
//                     email: response.data.data.user_credentials.email ?? '',
//                     // status: response.data.data.status === 'approved',
//                     status: response.data.data.status === 'approved' ? 'approved' : 'pending',
//                     provider_email: response.data.data.service_provider_info.email ?? '',
//                     provider_website: response.data.data.service_provider_info.website ?? '',
//                     provider_name: response.data.data.service_provider_info.provider_name ?? '',
//                     provider_number: response.data.data.service_provider_info.phone_number ?? '',
//                 });


//                 // setVendorData({
//                 //     provider_name: allVendors.data.vendors.provider_name ?? "",
//                 //     bill_id: allVendors.data.data.bill_category?._id ?? ""
//                 // });




//                 setLoading(false);
//             } catch (err) {
//                 // console.error("error: ", err)
//                 setError('Failed to load category data.');
//                 setLoading(false);
//             }
//         };
//         fetchCategoryData();
//     }, [id]);


//     const navigate = useNavigate();

//     const handleBack = () => {
//         navigate(-1); // Go back to the previous page
//     };

//     const handleSubmit = async (event) => {
//         event.preventDefault(); // Prevent form submission reload

//         try {
//             setLoading(true); // Show loading spinner while processing
//             const response = await api.put(`/bills/accounts/${id}`, { status: billData.status });

//             if (response.status === 200) {
//                 setSuccess('Status updated successfully!');
//             } else {
//                 setError('Failed to update the status. Please try again.');
//             }
//         } catch (err) {
//             console.error('Error updating status:', err);
//             setError('Failed to update the status. Please try again.');
//         } finally {
//             setLoading(false);
//             setTimeout(() => {
//                 navigate('/bills');
//             }, 2000);
//         }
//     };



//     const handleStatusChange = (e) => {
//         const { value } = e.target;
//         setBillData((prevState) => ({
//             ...prevState,
//             status: value,
//         }));
//     };

//     const handleChange = (event) => {
//         setSelectedVendor(event.target.value); // Update selected vendor
//     };


//     return (
//         <div className="container mt-5">
//             <SpinnerOverlay isLoading={loading} />
//             <CCard>
//                 <CCardHeader className="d-flex justify-content-between align-items-center">
//                     <h5 className="mb-0">Edit Bill</h5>
//                     <CButton color="secondary" size="sm" onClick={handleBack}>Back</CButton>
//                 </CCardHeader>
//                 <CCardBody>
//                     {error && <div className="alert alert-danger">{error}</div>}
//                     {success && <div className="alert alert-success">{success}</div>}
//                     <CForm onSubmit={handleSubmit}>
//                         <div className="mb-3">
//                             <CFormLabel htmlFor="name">User Name</CFormLabel>
//                             <CFormInput type="text" id="username" value={billData.username} required />
//                         </div>
//                         <div className="mb-3">
//                             <CFormLabel htmlFor="name">Name</CFormLabel>
//                             <CFormInput type="text" id="name" value={billData.first_name + " " + billData.last_name} required />
//                         </div>

//                         <div className="mb-3">
//                             <CFormLabel htmlFor="email">User Email</CFormLabel>
//                             <CFormInput type="text" id="email" value={billData.email} required />
//                         </div>

//                         <div className="mb-3">
//                             <CFormLabel htmlFor="account_numbber">Account Number</CFormLabel>
//                             <CFormInput type="text" id="account_numbber" value={billData.account_number} required />
//                         </div>
//                         <div className="mb-3">
//                             <CFormLabel htmlFor="vendor_name">Vendor Name</CFormLabel>
//                             <CFormInput type="text" id="vendor_name" value={billData.provider_name} required />
//                         </div>
//                         <div className="mb-3">
//                             <CFormLabel htmlFor="vendor_email">Vendor Email</CFormLabel>
//                             <CFormInput type="text" id="vendor_email" value={billData.provider_email} required />
//                         </div>
//                         <div className="mb-3">
//                             <CFormLabel htmlFor="vendor_number">Vendor Phone Number</CFormLabel>
//                             <CFormInput type="text" id="vendor_number" value={billData.provider_number} required />
//                         </div>
//                         <div className="mb-3">
//                             <CFormLabel htmlFor="vendor_website">Vendor Website</CFormLabel>
//                             <CFormInput type="text" id="vendor_website" value={billData.provider_website} required />
//                         </div>

//                         {/* <div className="mb-3">
//                             <CFormLabel htmlFor="type">Link to Vendor</CFormLabel>
//                             <CFormSelect id="type" required>
//                                 <option value="" selected>Select Vendor</option>

//                                 {vendors.map((vendor) => (
//                                     <option key={vendor._id} value={vendor._id}>
//                                         {vendor.provider_name}
//                                     </option>
//                                 ))}
//                             </CFormSelect>
//                         </div> */}

//                         <div className="mb-3">
//                             <CFormLabel htmlFor="type">Link to Vendor</CFormLabel>
//                             <CFormSelect
//                                 id="type"
//                                 required
//                                 value={selectedVendor} // Control the selected value
//                                 onChange={handleChange} // Handle selection changes
//                             >
//                                 <option value="" disabled>Select Vendor</option>
//                                 {vendors.map((vendor) => (
//                                     <option key={vendor._id} value={vendor._id}>
//                                         {vendor.provider_name}
//                                     </option>
//                                 ))}
//                             </CFormSelect>
//                         </div>


//                         <div className="mb-3">
//                             <CFormLabel htmlFor="type">Type</CFormLabel>
//                             <CFormSelect
//                                 id="status"
//                                 value={billData.status}
//                                 onChange={handleStatusChange}
//                             >
//                                 <option value="pending">Pending</option>
//                                 <option value="approved">Approved</option>
//                             </CFormSelect>
//                         </div>
//                         <CButton type="submit" color="primary">Submit</CButton>
//                     </CForm>
//                 </CCardBody>
//             </CCard>
//         </div>
//     );

// };

// export default EditBill;




import React, { useState, useEffect } from 'react';
import {
    CCard,
    CCardHeader,
    CCardBody,
    CButton,
    CForm,
    CFormLabel,
    CFormInput,
    CFormSelect,
} from '@coreui/react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/apiWrapper';
import SpinnerOverlay from '../../components/SpinnerOverlay';

const EditBill = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [billData, setBillData] = useState({
        account_number: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        username: '',
        user_email: '',
        status: 'pending',
        provider_email: '',
        provider_website: '',
        provider_name: '',
        bill_address_1: '',
        bill_address_2: '',
        user_country: '',
        user_state: '',
        user_city: '',
        user_zipcode: '',
        s_p_address_line_1: '',
        s_p_address_line_2: '',
        s_p_country: '',
        s_p_state: '',
        s_p_city: '',
        s_p_zip_code: '',
    });

    const [vendors, setVendors] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState('');
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ type: '', message: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const billResponse = await api.get(`/bills/accounts/${id}`);
                const vendorResponse = await api.get(`/bills/vendors`);

                const bill = billResponse.data.data;

                // const billInvoice  = await api.get(`/bills/invoices/671a5f60aa167d3f7e2e332d`);

                // console.log("Bill Invoice: " , billInvoice);

                console.log("response: ", bill)
                setBillData({
                    account_number: bill.account_number || '',
                    first_name: bill.first_name_on_bill || '',
                    middle_name: bill.middle_name_on_bill || '',
                    last_name: bill.last_name_on_bill || '',
                    username: bill.user_credentials?.username || '',
                    user_email: bill.user_credentials?.email || '',
                    status: bill.status === 'approved' ? 'approved' : 'pending',
                    provider_email: bill.service_provider_info?.email || '',
                    provider_website: bill.service_provider_info?.website || '',
                    provider_name: bill.service_provider_info?.provider_name || '',
                    provider_number: bill.service_provider_info?.phone_number || '',
                    bill_address_1: bill.bill_address?.address_line_1 || '',
                    bill_address_2: bill.bill_address?.address_line_2 || '',
                    user_country: bill.bill_address?.country || '',
                    user_state: bill.bill_address?.state || '',
                    user_city: bill.bill_address?.city || '',
                    user_zipcode: bill.bill_address?.zip_code || '',
                    s_p_address_line_1: bill.service_provider_info?.address?.address_line_1 || '',
                    s_p_address_line_2: bill.service_provider_info?.address?.address_line_2 || '',
                    s_p_country: bill.service_provider_info?.address?.country || '',
                    s_p_state: bill.service_provider_info?.address?.state || '',
                    s_p_city: bill.service_provider_info?.address?.city || '',
                    s_p_zip_code: bill.service_provider_info?.address?.zip_code || '',
                    
                });

                setSelectedVendor(bill.bill_vendor?._id ?? '');
                setVendors(vendorResponse.data.data.vendors);
            } catch (error) {
                setNotification({ type: 'danger', message: 'Failed to load data.' });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);

            const selectedVendorDetails = vendors.find((vendor) => vendor._id === selectedVendor);
            // const payload = {
            //     username: billData.username,
            //     name: `${billData.first_name} ${billData.last_name}`,
            //     email: billData.email,
            //     account_number: billData.account_number,
            //     vendor_name: billData.provider_name,
            //     vendor_email: billData.provider_email,
            //     vendor_number: billData.provider_number,
            //     vendor_website: billData.provider_website,
            //     link_to_vendor: selectedVendor,
            //     bill_vendor: {
            //         _id: selectedVendorDetails?._id || '',
            //         provider_name: selectedVendorDetails?.provider_name || '',
            //     },
            //     status: billData.status,
            // };

            const payload = {
                account_number: billData.account_number,
                bill_address: {
                    address_line_1: billData.bill_address?.address_line_1 || '',
                    address_line_2: billData.bill_address?.address_line_2 || '',
                    city: billData.bill_address?.city || '',
                    state: billData.bill_address?.state || '',
                    country: billData.bill_address?.country || '',
                    zip_code: billData.bill_address?.zip_code || '',
                },
                bill_vendor: {
                    _id: selectedVendorDetails?._id || '',
                    provider_name: selectedVendorDetails?.provider_name || '',
                },
                first_name_on_bill: billData.first_name_on_bill,
                middle_name_on_bill: billData.middle_name_on_bill,
                last_name_on_bill: billData.last_name_on_bill,
                service_provider_info: {
                    email: billData.service_provider_info?.email || '',
                    phone_number: billData.service_provider_info?.phone_number || '',
                    website: billData.service_provider_info?.website || '',
                    address: {
                        line_1: billData.service_provider_info?.address?.line_1 || '',
                        line_2: billData.service_provider_info?.address?.line_2 || '',
                        city: billData.service_provider_info?.address?.city || '',
                        state: billData.service_provider_info?.address?.state || '',
                        country: billData.service_provider_info?.address?.country || '',
                        zip_code: billData.service_provider_info?.address?.zip_code || '',
                    },
                },
                status: billData.status,
            };
            



            console.log("payload: ", payload);

            const response = await api.put(`/bills/accounts/${id}`, payload);

            if (response.status === 200) {
                setNotification({ type: 'success', message: 'Bill updated successfully!' });
                setTimeout(() => navigate('/bills'), 2000);
            } else {
                setNotification({ type: 'danger', message: 'Failed to update the bill.' });
            }
        } catch (error) {
            console.error('Error updating bill:', error);
            setNotification({ type: 'danger', message: 'An error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    // const handleInputChange = (e) => {
    //     const { id, value } = e.target;
    //     setBillData((prev) => ({ ...prev, [id]: value }));
    // };

    const handleInputChange = (event) => {
        const { id, value } = event.target;
    
        setBillData((prev) => {
            const newData = { ...prev };
            if (id.startsWith('bill_address_')) {
                newData.bill_address = {
                    ...newData.bill_address,
                    [id.replace('bill_address_', '')]: value,
                };
            } else if (id.startsWith('s_p_')) {
                newData.service_provider_info = {
                    ...newData.service_provider_info,
                    [id.replace('s_p_', '')]: value,
                };
            } else {
                newData[id] = value;
            }
            return newData;
        });
    };
    



    const handleVendorChange = (e) => {
        setSelectedVendor(e.target.value);
    };

    return (
        <div className="container mt-5">
            <SpinnerOverlay isLoading={loading} />
            <CCard className='card-dark-mode'>
                <CCardHeader className="d-flex justify-content-between align-items-center">
                    <h5>Edit Bill</h5>
                    <CButton color="secondary" size="sm" onClick={() => navigate(-1)}>
                        Back
                    </CButton>
                </CCardHeader>
                <CCardBody>
                    {notification.message && (
                        <div className={`alert alert-${notification.type}`}>{notification.message}</div>
                    )}
                    <CForm onSubmit={handleSubmit}>
                        {/* <div className="mb-3">
                            <CFormLabel htmlFor="username">User Name</CFormLabel>
                            <CFormInput
                                type="text"
                                id="username"
                                value={billData.username}

                            />
                        </div> */}
                        <div className="mb-3">
                            <CFormLabel htmlFor="name">First Name on Bill</CFormLabel>
                            <CFormInput
                                type="text"
                                id="first_name"
                                value={billData.first_name ?? ''}
                                onChange={handleInputChange}

                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="name">Middle Name on Bill</CFormLabel>
                            <CFormInput
                                type="text"
                                id="middle_name"
                                value={billData.middle_name ?? ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="name">Last Name on Bill</CFormLabel>
                            <CFormInput
                                type="text"
                                id="last_name"
                                value={billData.last_name ?? ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="user_email">User Email</CFormLabel>
                            <CFormInput type="text" id="user_email" value={billData.user_email ?? ''} onChange={handleInputChange}/>
                        </div>
                        {/* <div className="mb-3">
                            <CFormLabel htmlFor="account_number">Account Number</CFormLabel>
                            <CFormInput
                                type="text"
                                id="account_number"
                                value={billData.account_number}

                            />
                        </div> */}



                        <div className="mb-3">
                            <CFormLabel htmlFor="account_number">Account Number</CFormLabel>
                            <CFormInput type="text" id="account_number" value={billData.account_number ?? ''} required onChange={handleInputChange}/>
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="bill_address_1">Bill Address Line 1</CFormLabel>
                            <CFormInput type="text" id="bill_address_1" value={billData.bill_address_1 ?? ''} onChange={handleInputChange} />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="bill_address_2">Bill Address Line 2</CFormLabel>
                            <CFormInput type="text" id="bill_address_2" value={billData.bill_address_2 ?? ''} onChange={handleInputChange}/>
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="user_country">Country</CFormLabel>
                            <CFormInput type="text" id="user_country" value={billData.user_country ?? ''} required onChange={handleInputChange} />
                        </div>
                        

                        <div className="mb-3">
                            <CFormLabel htmlFor="user_state">State</CFormLabel>
                            <CFormInput type="text" id="user_state" value={billData.user_state ?? ''} required onChange={handleInputChange} />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="user_city">City</CFormLabel>
                            <CFormInput type="text" id="user_city" value={billData.user_city ?? ''} required onChange={handleInputChange} />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="user_zipcode">Zip Code</CFormLabel>
                            <CFormInput type="text" id="user_zipcode" value={billData.user_zipcode ?? ''} required onChange={handleInputChange} />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="provider_name">Vendor Name</CFormLabel>
                            <CFormInput type="text" id="provider_name" value={billData.provider_name ?? ''} required onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="provider_email">Vendor Email</CFormLabel>
                            <CFormInput type="text" id="provider_email" value={billData.provider_email ?? ''} required onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="provider_number">Vendor Phone Number</CFormLabel>
                            <CFormInput type="text" id="provider_number" value={billData.provider_number ?? ''} required onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="provider_website">Vendor Website</CFormLabel>
                            <CFormInput type="text" id="provider_website" value={billData.provider_website ?? ''} required onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="s_p_address_line_1">Service Provider Address Line 1</CFormLabel>
                            <CFormInput type="text" id="s_p_address_line_1" value={billData.s_p_address_line_1 ?? ''} required onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="s_p_address_line_2">Service Provider Address Line 2</CFormLabel>
                            <CFormInput type="text" id="s_p_address_line_2" value={billData.s_p_address_line_2 ?? ''} required onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="s_p_country">Service Provider Country</CFormLabel>
                            <CFormInput type="text" id="s_p_country" value={billData.s_p_country ?? ''} required onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="s_p_state">Service Provider State</CFormLabel>
                            <CFormInput type="text" id="s_p_state" value={billData.s_p_state ?? ''} required onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="s_p_city">Service Provider City</CFormLabel>
                            <CFormInput type="text" id="s_p_city" value={billData.s_p_city ?? ''} required onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="s_p_zip_code">Service Provider Zip Code</CFormLabel>
                            <CFormInput type="text" id="s_p_zip_code" value={billData.s_p_zip_code ?? ''} required onChange={handleInputChange} />
                        </div>


                        <div className="mb-3">
                            <CFormLabel htmlFor="type">Link to Vendor</CFormLabel>
                            <CFormSelect
                                id="type"
                                value={selectedVendor}
                                onChange={handleVendorChange}
                                required 
                            >
                                <option value="" disabled>
                                    Select Vendor
                                </option>
                                {vendors.map((vendor) => (
                                    <option key={vendor._id} value={vendor._id}>
                                        {vendor.provider_name}
                                    </option>
                                ))}
                            </CFormSelect>
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="status">Status</CFormLabel>
                            <CFormSelect
                                id="status"
                                value={billData.status}
                                onChange={handleInputChange}
                            >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                            </CFormSelect>
                        </div>

                        <CButton type="submit" color="primary">
                            Submit
                        </CButton>
                    </CForm>
                </CCardBody>
            </CCard>
        </div>
    );
};

export default EditBill;
