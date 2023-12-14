import React, { useState } from 'react';
import axios from 'axios';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const [loginFormData, setLoginFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setLoginFormData({
      ...loginFormData,
      [e.target.name]: e.target.value,
    });
  };

  const [displayError, setDisplayError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call 1: POST to /accounts/login/ to get access and refresh tokens
      const response = await axios.post(
        'http://localhost:8000/accounts/login/',
        loginFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const access_token = response.data.access;
      const refresh_token = response.data.refresh;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      setDisplayError(false);
      // Call 2: GET to /accounts/user-type/ to get user email and if user is pet shelter or not
      const user_context_info_resp = await fetch(
        'http://127.0.0.1:8000/accounts/user-type/',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (user_context_info_resp.ok) {
        const user_context_info = await user_context_info_resp.json();
        const user_email = user_context_info.email;
        const user_is_shelter = user_context_info.is_pet_shelter;
        localStorage.setItem('is_pet_shelter_user', user_is_shelter);
        localStorage.setItem('user_email', user_email);
      } else {
        console.error('error when retrieving if user is pet shelter or not');
      }

      // Call 3:
      const user_ids_resp = await fetch(
        'http://127.0.0.1:8000/accounts/user/',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (user_ids_resp.ok) {
        const user_context_info_ids = await user_ids_resp.json();
        const user_user = user_context_info_ids.user;
        const user_id = user_context_info_ids.id;
        const user_name = user_context_info_ids.name;
        localStorage.setItem('user_user', user_user);
        localStorage.setItem('user_id', user_id);
        localStorage.setItem('user_name', user_name);

        navigate('/account-information');
        window.location.reload();
      } else {
        console.error('error when retrieving user ids and name');
      }
    } catch (error) {
      console.error('LOGIN FAIL,', error.message);
      setDisplayError(true);
    }
  };
  return (
    <Container mb={10}>
      <Box
        mt={10}
        mb={20}
        bg='#FFFFFF'
        borderWidth='8px'
        borderRadius='lg'
        borderColor='#BEE3F8'
        p={4}
      >
        <Heading textAlign='center' mb={4}>
          Login to <Text color='blue.500'>Barnyard Buddies</Text>
        </Heading>
        {displayError && (
          <Alert status='error' borderRadius='lg' mb={4}>
            <AlertIcon />
            Invalid email or password. Please try again.
          </Alert>
        )}
        <Text fontsize='md' align='center' pb={4}>
          Do not have an account?{' '}
          <Link color='blue.500' href='/register'>
            Register!
          </Link>
        </Text>
        <form onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel>Email:</FormLabel>
            <Input
              type='email'
              name='email'
              placeholder='Enter your email'
              value={loginFormData.email}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Password:</FormLabel>
            <Input
              type='password'
              name='password'
              placeholder='Enter your password'
              value={loginFormData.password}
              onChange={handleChange}
              required
            />
          </FormControl>
          <Center>
            <Button type='submit' colorScheme='blue' isFullWidth='true'>
              Login
            </Button>
          </Center>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
