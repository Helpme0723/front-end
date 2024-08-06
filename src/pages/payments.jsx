import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function payInfo() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pg, setPg] = useState('');
  const [oayMethod, setPayMethod] = useState('');

  if (!isAuthenticated) {
    alert('로그인이 필요합니다.');
    navigate('/');
    return null;
  }

  const handleCancel = () => {
    navigate('/edit-profile');
  };
  const data = null;
  return { data: data };
}

export default payInfo;
