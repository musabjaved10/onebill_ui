import React, { useState } from 'react';
import { CCard, CCardHeader, CCardBody, CCardTitle, CCardText, CButton, CForm, CFormLabel, CFormInput } from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/apiWrapper';
import SpinnerOverlay from '../../components/SpinnerOverlay';


const AddCategory = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);


  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await api.post('/bills/categories', { name });
      if (response.status === 201 || response.status === 200) {
        alert('Category added successfully!');
        navigate(-1);
      } else {
        alert('Failed to add category.');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('An error occurred while adding the category.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
            <SpinnerOverlay isLoading={loading} />

      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Add Category</h5>
          <CButton color="secondary" size="sm" onClick={handleBack}>
            Back
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <div className="mb-3">
              <CFormLabel htmlFor="name">Category Name</CFormLabel>
              <CFormInput
                type="text"
                id="name"
                placeholder="Enter name"
                required
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
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

export default AddCategory;
