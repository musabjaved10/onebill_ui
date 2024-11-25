import React, { useState, useEffect } from 'react';
import { 
  CCard, 
  CCardHeader, 
  CCardBody, 
  CButton, 
  CForm, 
  CFormLabel, 
  CFormInput 
} from '@coreui/react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/apiWrapper';
import SpinnerOverlay from '../../components/SpinnerOverlay';

const EditCategory = () => {
  const { id } = useParams(); // Get category ID from route
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState({
    name: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch category data when the component loads
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/bills/categories/${id}`);
        setCategoryData({
          name: response.data.data.name ?? '',
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load category data.');
        setLoading(false);
      }
    };
    fetchCategoryData();
  }, [id]);

  // Handle form submission to edit the category
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await api.put(`/bills/categories/${id}`, categoryData);
      setSuccess('Category updated successfully!');
      setLoading(false);
      setTimeout(() => {
        navigate('/category'); 
      }, 2000);
    } catch (err) {
      setError('Failed to update category.');
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="container mt-5">
      <SpinnerOverlay isLoading={loading} />
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Edit Category</h5>
          <CButton color="secondary" size="sm" onClick={handleBack}>Back</CButton>
        </CCardHeader>
        <CCardBody>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <CForm onSubmit={handleSubmit}>
            <div className="mb-3">
              <CFormLabel htmlFor="name">Category Name</CFormLabel>
              <CFormInput 
                type="text" 
                id="name"
                name="name"
                placeholder="Enter name" 
                required 
                value={categoryData?.name || ''} 
                onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })}
              />
            </div>
            <CButton type="submit" color="primary">Submit</CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default EditCategory;
