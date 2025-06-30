import React, { useEffect, useState } from 'react';
import { CCard, CCardHeader, CCardBody, CCardTitle, CCardText, CButton, CForm, CFormLabel, CFormInput, CFormSelect, CFormTextarea } from '@coreui/react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
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
    const [accounts, setAccounts] = useState([]);
    const [vendors, setVendors] = useState([]);

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
        status: '',
    });

    useEffect(() => {
        const fetchInvoiceData = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/bills/invoices/${id}`);
                const data = response.data.data.invoice;
                setBillInvoice({
                    ...billInvoice,
                    bill_account: data?.bill_account?.account_number ?? '', // Ensure this is set correctly
                    month: data.month ?? '',
                    amount: data.amount ?? '',
                    year: data.year ?? '',
                    due_date: data.due_date ? new Date(data.due_date) : '',
                    late_fees: data.late_fee ?? '',
                    notes: data.notes ?? '',
                    status: data.status ?? '',
                    amount_paid: data?.payment_info?.amount_paid ?? '',
                    payment_date: data?.payment_info?.payment_date ? new Date(data.payment_info.payment_date) : '',
                    bill_category: data?.bill_account?.bill_category?.name ?? '',
                    bill_vendor: data?.bill_account?.bill_vendor?.provider_name ?? '',
                });
            } catch (err) {
                setError('Failed to load invoice data.');
            } finally {
                setLoading(false);
            }
        };

        const fetchAllAccounts = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/bills/accounts`);
                setAccounts(response.data.data.accounts);
            } catch (error) {
                console.error("Error fetching accounts:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchAllVendors = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/bills/vendors`);
                setVendors(response.data.data.vendors);
            } catch (error) {
                console.error("Error fetching vendors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoiceData();
        fetchAllAccounts();
        fetchAllVendors();
    }, [id]);

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

    const handleVendorChange = (selectedOption) => {
        setBillInvoice((prevData) => ({
            ...prevData,
            bill_vendor: selectedOption ? selectedOption.value : '',
        }));
    };

    const handleDateChange = (date, field) => {
        setBillInvoice((prevData) => ({
            ...prevData,
            [field]: date,
        }));
    };

    const handleStatusChange = (e) => {
        const { value } = e.target;
        setBillInvoice((prevData) => ({
            ...prevData,
            status: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        console.log('post:', billInvoice);
        const postData = {
            month: billInvoice.month,
            year: billInvoice.year,
            amount: parseFloat(billInvoice.amount),
            due_date: billInvoice.due_date.toISOString().split('T')[0],
            late_fee: parseFloat(billInvoice.late_fees),
            notes: billInvoice.notes,
            amount_paid: billInvoice.amount_paid,
            payment_date: billInvoice.payment_date ? billInvoice.payment_date.toISOString().split('T')[0] : '',
            status: billInvoice.status,
        };
    
        try {
            setLoading(true);
            const response = await api.put(`/bills/invoices/${id}`, postData);
    
            if (response.data.success) {
                // First API success → hit second API
                const paymentResponse = await api.post(`/bills/invoices/${id}/record-payment`, {
                    mode_of_payment: 'Bank Transfer',
                });
    
                if (paymentResponse.data.success) {
                    setSuccess('Invoice updated and payment recorded successfully!');
                    setTimeout(() => {
                        navigate(-1);
                    }, 2000);
                } else {
                    setError('Invoice updated, but failed to record payment.');
                }
            }
        } catch (error) {
            console.error('Error posting data:', error);
            setError('Failed to update invoice or record payment.');
        } finally {
            setLoading(false);
        }
    };
    

    const handleBack = () => {
        navigate(-1);
    };

    const accountOptions = accounts.map((account) => ({
        value: account._id,
        label: `${account.account_number} - ${account.first_name_on_bill} ${account.last_name_on_bill}`,
    }));

    const vendorOptions = vendors.map((vendor) => ({
        value: vendor._id,
        label: vendor.provider_name,
    }));

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            color: "black",
            backgroundColor: state.isSelected ? "#e0e0e0" : "white",
            "&:hover": {
                backgroundColor: "#f0f0f0",
            },
        }),
        control: (provided) => ({
            ...provided,
            backgroundColor: "white",
        }),
        singleValue: (provided) => ({
            ...provided,
            color: "black",
        }),
        input: (provided) => ({
            ...provided,
            color: "black",
        }),
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
                                value={accountOptions.find(option => option.value === billInvoice.bill_account) || null}
                                placeholder="Search or select a bill account"
                                isClearable
                                isSearchable
                                styles={customStyles}
                            />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="month">Bill Month</CFormLabel>
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
                            <CFormSelect
                                id="year"
                                value={billInvoice.year}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Year</option>
                                {Array.from({ length: 10 }, (_, i) => {
                                    const year = new Date().getFullYear() - i;
                                    return (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    );
                                })}
                            </CFormSelect>
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
                            <div className="w-full">
                                <DatePicker
                                    selected={billInvoice.due_date}
                                    onChange={(date) => handleDateChange(date, 'due_date')}
                                    dateFormat="yyyy-MM-dd"
                                    className="form-control w-full datepicker-input"
                                    id="due_date"
                                />
                            </div>
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
                                placeholder="Enter Amount Paid"
                                value={billInvoice.amount_paid}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="payment_date">Payment Date</CFormLabel>
                            <div className="w-full">
                                <DatePicker
                                    selected={billInvoice.payment_date}
                                    onChange={(date) => handleDateChange(date, 'payment_date')}
                                    dateFormat="yyyy-MM-dd"
                                    className="form-control w-full datepicker-input"
                                    id="payment_date"
                                    isClearable // Allow clearing the date
                                    placeholderText="Select Payment Date" // Add a placeholder
                                    // required
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="bill_category">Bill Category</CFormLabel>
                            <CFormInput
                                type="text"
                                id="bill_category"
                                placeholder="Enter Bill Category"
                                value={billInvoice.bill_category}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="bill_vendor">Bill Vendor</CFormLabel>
                            <Select
                                options={vendorOptions}
                                onChange={handleVendorChange}
                                value={vendorOptions.find(option => option.value === billInvoice.bill_vendor)}
                                placeholder="Search or select a bill vendor"
                                isClearable
                                isSearchable
                                styles={customStyles}
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
                                {/* <option value="overdue">Overdue</option> */}
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
