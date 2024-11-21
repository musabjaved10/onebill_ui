import React, { useEffect, useState } from 'react';
import { CCard, CCardHeader, CCardBody, CButton, CForm, CFormLabel, CFormInput, CFormSelect } from '@coreui/react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/apiWrapper';
import SpinnerOverlay from '../../components/SpinnerOverlay';

const EditUser = () => {
  const { id } = useParams(); // Get the user ID from the route params
  const navigate = useNavigate();
  

  const handleStatusChange = (e) => {
    const { id, value } = e.target;
    // console.log(e.target);

    setUserData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    username: ''
  });
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');

  // Fetch user data by ID
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/users/${id}`); // API call with user ID
        console.log("SIngle USER DATA: ", response)
        setUserData({
          first_name: response.data.data.first_name ?? "",
          middle_name: response.data.data.middle_name ?? "",
          last_name: response.data.data.last_name ?? "",
          phone_number: response.data.data.phone_number ?? "",
          is_verified: response.data.data.is_verified ?? "",
          email: response.data.data.email ?? "",
          // username: response.data.data.username
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load user data.');
        setLoading(false);
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
      [id]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.put(`/users/${id}`, userData); // Update user data via API
      alert('User updated successfully');
      navigate('/users'); // Redirect to users list or another page
    } catch (err) {
      alert('Failed to update user');
    }
  };

  // if (loading) {
  //   return <p>Loading...</p>;
  // }

  // if (error) {
  //   return <p>{error}</p>;
  // }

  return (
    <div className="container mt-5">
      <SpinnerOverlay isLoading={loading} />
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Edit User</h5>
          <CButton color="secondary" size="sm" onClick={handleBack}>Back</CButton>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <div className="mb-3">
              <CFormLabel htmlFor="first_name">First Name</CFormLabel>
              <CFormInput
                type="text"
                id="first_name"
                placeholder="Enter name"
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
                placeholder="Enter name"
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
                placeholder="Enter name"
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
                placeholder="Enter username"
                value={userData.phone_number}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="status">Status</CFormLabel>
              <CFormSelect
                id="is_verified"
                value={userData.is_verified ? "approved" : "pending"}
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
