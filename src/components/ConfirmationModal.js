import React from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react';

const ConfirmationModal = ({ show, onHide, onConfirm, message }) => {
  return (
    <CModal visible={show} onClose={onHide} alignment="center">
      <CModalHeader>
        <CModalTitle>Confirm Delete</CModalTitle>
      </CModalHeader>
      <CModalBody>{message}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onHide}>
          No
        </CButton>
        <CButton color="danger" onClick={onConfirm}>
          Yes
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ConfirmationModal;