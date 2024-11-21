import React, { useState, useEffect } from 'react';
import { 
  CCard, 
  CCardHeader, 
  CCardBody, 
  CCardTitle, 
  CCardText, 
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
  // const [categoryData, setCategoryData] = useState(null); // State for category data

  const [categoryData, setCategoryData] = useState({
    name: ''
  });

  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');
  useEffect(() => {
    const fetchCategoryData = async () => {
      // console.log('in function');
      try {
        setLoading(true);
        const response = await api.get(`/bills/categories/${id}`); // API call with user ID
        console.log("SIngle CATEGORY DATA: ", response)
        setCategoryData({
          name: response.data.data.name ?? "",
          
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load category data.');
        setLoading(false);
      } finally {
        setLoading(false); // Hide spinner
      }
    };
    fetchCategoryData();
  }, [id]);




  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here (e.g., API call to update the category)
  };

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mt-5">
      <SpinnerOverlay isLoading={loading} />
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Edit Category</h5>
          <CButton color="secondary" size="sm" onClick={handleBack}>Back</CButton>
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
