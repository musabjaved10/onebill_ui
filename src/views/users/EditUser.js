import React, { useEffect, useState } from 'react';
import { CCard, CCardHeader, CCardBody, CButton, CForm, CFormLabel, CFormInput, CFormSelect } from '@coreui/react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/apiWrapper';
import SpinnerOverlay from '../../components/SpinnerOverlay';

const EditUser = () => {
  const { id } = useParams(); // Get the user ID from the route params
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    is_verified: '',
  });
  const [loading, setLoading] = useState(true);

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Fetch user data by ID
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/users/${id}`); // API call with user ID
        const data = response.data.data; // Assuming API returns `data` object
        console.log('response: ' , data)
        setUserData({
          first_name: data.first_name ?? '',
          middle_name: data.middle_name ?? '',
          last_name: data.last_name ?? '',
          phone_number: data.phone_number ?? '',
          email: data.email ?? '',
          is_verified: data.is_verified ? 'approved' : 'pending',
        });
      } catch (err) {
        setError('Failed to load user data.');
      } finally {
        setLoading(false); // Hide spinner
      }
    };
    fetchUserData();
  }, [id]);

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleStatusChange = (e) => {
    const { value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      is_verified: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const updatedData = {
        first_name: userData.first_name,
        middle_name: userData.middle_name,
        last_name: userData.last_name,
        phone_number: userData.phone_number,
        email: userData.email,
        is_verified: userData.is_verified === 'approved',
      };
      await api.put(`/users/${id}`, updatedData); // Update user data via API
      // alert('User updated successfully');
      setSuccess('User updated successfully!');
      setTimeout(() => {
        navigate('/user');
    }, 2000);
      // navigate('/user'); // Redirect to users list or another page
    } catch (err) {
      // alert('Failed to update user');
      setError('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <SpinnerOverlay isLoading={loading} />
      <CCard className='card-dark-mode'>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Edit User</h5>
          <CButton color="secondary" size="sm" onClick={handleBack}>Back</CButton>
        </CCardHeader>
        <CCardBody>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
          {/* {error && <p className="text-danger">{error}</p>} */}
          <CForm onSubmit={handleSubmit}>
            <div className="mb-3">
              <CFormLabel htmlFor="first_name">First Name</CFormLabel>
              <CFormInput
                type="text"
                id="first_name"
                placeholder="Enter first name"
                value={userData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="middle_name">Middle Name</CFormLabel>
              <CFormInput
                type="text"
                id="middle_name"
                placeholder="Enter middle name"
                value={userData.middle_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="last_name">Last Name</CFormLabel>
              <CFormInput
                type="text"
                id="last_name"
                placeholder="Enter last name"
                value={userData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="email">Email</CFormLabel>
              <CFormInput
                type="email"
                id="email"
                placeholder="Enter email"
                value={userData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="phone_number">Phone Number</CFormLabel>
              <CFormInput
                type="text"
                id="phone_number"
                placeholder="Enter phone number"
                value={userData.phone_number}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="is_verified">Status</CFormLabel>
              <CFormSelect
                id="is_verified"
                value={userData.is_verified}
                onChange={handleStatusChange}
              >
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </CFormSelect>
            </div>
            <CButton type="submit" color="primary">Submit</CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default EditUser;











