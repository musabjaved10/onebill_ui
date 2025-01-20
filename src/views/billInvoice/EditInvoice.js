import React, { useEffect, useState } from 'react';
import { CCard, CCardHeader, CCardBody, CCardTitle, CCardText, CButton, CForm, CFormLabel, CFormInput, CFormSelect, CFormTextarea } from '@coreui/react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
// import axios from 'axios';
import DatePicker from 'react-datepicker';
import api from '../../api/apiWrapper';
import SpinnerOverlay from '../../components/SpinnerOverlay';
import "react-datepicker/dist/react-datepicker.css";

const EditInvoice = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [bills, setBills] = useState([]);
    const [accounts, setAccounts] = useState([]);


    const fetchAllAccounts = async (page = 1, allAccounts = []) => {
        try {
            setLoading(true); // Show spinner

            // API Call with pagination
            const response = await api.get(`/bills/accounts`);

            const { accounts: currentAccounts, pagination } = response.data.data;
            const updatedAccounts = [...allAccounts, ...currentAccounts];

            if (page < pagination.totalPages) {
                // If more pages are available, fetch next page
                return fetchAllAccounts(page + 1, updatedAccounts);
            } else {
                // console.log("Response:", updatedAccounts);

                // All data fetched
                setAccounts(updatedAccounts);
                setLoading(false); // Hide spinner
                return updatedAccounts;
            }
        } catch (error) {
            console.error("Error fetching accounts:", error);
            setLoading(false); // Hide spinner
        }
    };
    const [billInvoice, setBillInvoice] = useState({
        bill_account: '',
        month: '',
        amount: '',
        year: '',
        due_date: '',
        late_fees: '',
        notes: '',
        amount_paid: '',
        payment_date: '',
        bill_category: '',
        bill_vendor: '',
    });

    useEffect(() => {
        const fetchInvoiceData = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/bills/invoices/${id}`); // API call with user ID
                const data = response.data.data; // Assuming API returns `data` object
                console.log('response: ', data)
                setBillInvoice({
                    bill_account: data?.bill_account?.account_number ?? '',
                    month: data.month ?? '',
                    amount: data.amount ?? '',
                    year: data.year ?? '',
                    due_date: data.due_date ?? '',
                    late_fees: data.late_fee ?? '',
                    notes: data.notes ?? '',
                    status: data.status ?? '',
                    amount_paid: data?.payment_info?.amount_paid ?? '',
                    payment_date: data?.payment_info?.payment_date ?? '',
                    bill_category: data?.bill_account?.bill_category?.name ?? '',
                    bill_vendor: data?.bill_account?.bill_vendor?.provider_name ?? '',
                });
            } catch (err) {
                setError('Failed to load invoice data.');
            } finally {
                setLoading(false); // Hide spinner
            }
        };
        // console.log(invoiceData)
        fetchInvoiceData();
        fetchAllAccounts(); // Fetch all accounts on mount
    }, [id]);

    // Handle input change
    const handleChange = (e) => {
        const { id, value } = e.target;
        setBillInvoice((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };


    const handleDropdownChange = (selectedOption) => {
        setBillInvoice((prevData) => ({
            ...prevData,
            bill_account: selectedOption ? selectedOption.value : '',
        }));
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        const postData = {
            // bill_account: billInvoice.bill_account,
            month: billInvoice.month,
            year: billInvoice.year,
            amount: parseFloat(billInvoice.amount), // Ensure the amount is a number
            due_date: (billInvoice.due_date instanceof Date)
                ? billInvoice.due_date.toISOString().split('T')[0] // Format date to 'yyyy-mm-dd'
                : billInvoice.due_date ? new Date(billInvoice.due_date).toISOString().split('T')[0] : '', // Convert to Date if string
            late_fee: parseFloat(billInvoice.late_fees), // Ensure late fees are numbers
            notes: billInvoice.notes,
            amount_paid: billInvoice.amount_paid,
            payment_date: billInvoice.payment_date,
            status: billInvoice.status,
        };

        console.log(postData);


        try {
            setLoading(true); // Start loading state
            const response = await api.put(`/bills/invoices/${id}`, postData);
            //   await api.put(`/users/${id}`, updatedData); // Update user data via API


            // Check for success or failure
            if (response.data.success) {
                setSuccess('Invoice updated successfully!');
                setTimeout(() => {
                    navigate(-1); // Redirect to the invoices list page after success
                }, 2000);
            }
        } catch (error) {
            console.error('Error posting data:', error);
            setError('Failed to create invoice.');
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };


    const handleBack = () => {
        navigate(-1);
    };

    const accountOptions = accounts.map((account) => ({
        value: account._id,
        label: `${account.account_number} - ${account.first_name_on_bill} ${account.last_name_on_bill}`,
    }));

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handleDateChange = (date) => {
        setBillInvoice((prevData) => ({
            ...prevData,
            due_date: date,
        }));
    };

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            color: "black", // Set the text color to black for all options
            backgroundColor: state.isSelected ? "#e0e0e0" : "white",
            "&:hover": {
                backgroundColor: "#f0f0f0",
            },
        }),
        control: (provided) => ({
            ...provided,
            backgroundColor: "white", // Set the background color of the control
        }),
        singleValue: (provided) => ({
            ...provided,
            color: "black", // Set the color of the selected value
        }),
        input: (provided) => ({
            ...provided,
            color: "black", // Set the color of the input text
        }),
    }

    const handleStatusChange = (e) => {
        const { value } = e.target;
        setUserData((prevState) => ({
            ...prevState,
            status: value,
        }));
    };

    return (
        <div className="container mt-5">
            <SpinnerOverlay isLoading={loading} />

            <CCard className='card-dark-mode'>
                <CCardHeader className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Edit Invoice</h5>
                    <CButton color="secondary" size="sm" onClick={handleBack}>Back</CButton>
                </CCardHeader>
                <CCardBody>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <CForm onSubmit={handleSubmit}>


                        <div className="mb-3">
                            <label htmlFor="bill_account" className="form-label">Bill Account</label>
                            <Select
                                options={accountOptions}
                                onChange={handleDropdownChange}
                                value={billInvoice.bill_account}
                                placeholder="Search or select a bill account"
                                isClearable
                                isSearchable
                                styles={customStyles}
                            />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="month">Bill Category</CFormLabel>
                            <CFormSelect
                                id="month"
                                value={billInvoice.month}
                                onChange={handleChange}
                                required>
                                <option value="">-- Select Month --</option>
                                {months.map((month, index) => (
                                    <option key={index} value={month}>
                                        {month}
                                    </option>
                                ))}
                            </CFormSelect>
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="year">Year</CFormLabel>
                            <CFormInput
                                type="text"
                                id="year"
                                placeholder="Enter Year"
                                value={billInvoice.year}
                                onChange={handleChange}
                                required
                            // value={userData.first_name}

                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="amount">Amount</CFormLabel>
                            <CFormInput
                                type="text"
                                id="amount"
                                placeholder="Enter Amount"
                                value={billInvoice.amount}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="due_date">Select Due Date</CFormLabel>
                            <DatePicker
                                selected={billInvoice.due_date}
                                onChange={handleDateChange}
                                dateFormat="yyyy-MM-dd"
                                className="form-control w-full datepicker-input"
                                id="due_date"
                            />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="late_fees">Late Fees</CFormLabel>
                            <CFormInput
                                type="text"
                                id="late_fees"
                                placeholder="Enter Late Fees"
                                value={billInvoice.late_fees}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="amount_paid">Amount Paid</CFormLabel>
                            <CFormInput
                                type="text"
                                id="amount_paid"
                                placeholder="Enter Late Fees"
                                value={billInvoice.amount_paid}
                                onChange={handleChange}

                            />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="payment_date">Payment Date</CFormLabel>
                            <CFormInput
                                type="text"
                                id="payment_date"
                                placeholder="Enter Late Fees"
                                value={billInvoice.payment_date}
                                onChange={handleChange}

                            />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="bill_category">Bill Category</CFormLabel>
                            <CFormInput
                                type="text"
                                id="bill_category"
                                placeholder="Enter Late Fees"
                                value={billInvoice.bill_category}
                                onChange={handleChange}

                            />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="bill_vendor">Bill Vendor</CFormLabel>
                            <CFormInput
                                type="text"
                                id="bill_vendor"
                                placeholder="Enter Late Fees"
                                value={billInvoice.bill_vendor}
                                onChange={handleChange}

                            />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="notes">Notes</CFormLabel>
                            <CFormTextarea
                                id="notes"
                                placeholder="Enter your notes here..."
                                rows="4"
                                value={billInvoice.notes}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="status">Status</CFormLabel>
                            <CFormSelect
                                id="status"
                                value={billInvoice.status}
                                onChange={handleStatusChange}
                            >
                                <option value="paid">Paid</option>
                                <option value="unpaid">Un-Paid</option>
                                <option value="overdue">Overdue</option>
                            </CFormSelect>
                        </div>


                        <CButton type="submit" color="primary">Submit</CButton>
                    </CForm>
                </CCardBody>
            </CCard>
        </div>
    );
};

export default EditInvoice;
