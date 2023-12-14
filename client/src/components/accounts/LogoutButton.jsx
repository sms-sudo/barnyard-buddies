import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

const LogoutButton = () => {
  const nav = useNavigate();
  const performLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('is_pet_shelter_user');
    localStorage.removeItem('user_user');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');

    nav('/login');
    window.location.reload();
  };
  return <Button onClick={performLogout}>Logout</Button>;
};

export default LogoutButton;
