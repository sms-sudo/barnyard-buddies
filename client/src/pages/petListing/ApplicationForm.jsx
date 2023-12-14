import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  Box,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton
} from '@chakra-ui/react';
import axios from 'axios';
import { Navigate, useParams, useNavigate } from 'react-router-dom';

const ApplicationForm = () => {
  const [applicationData, setApplicationData] = useState({
    seeker_home_type: '',
    seeker_yard_size: '',
    seeker_pet_care_experience: '',
    seeker_previous_pets: ''
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setApplicationData({ ...applicationData, [e.target.name]: e.target.value });
  };
  const { petId } = useParams();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...applicationData,
      pet_listing: petId
    };

    try {
      const response = await axios.post(`http://127.0.0.1:8000/petListing/${petId}/applications/`, data,{
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
        },
    });
      console.log(response.data);
      // Handle success - maybe clear form or show success message
      setShowSuccessMessage(true)
      navigate(`/my_application/${localStorage.getItem('is_pet_shelter_user')}/${localStorage.getItem('user_user')}`);
    } catch (error) {
      console.error('Error submitting application:', error);
      // Handle error - show error message to user
      setShowErrorMessage(true)
    }
  };
  const closeSuccessMessage = () => {
    setShowSuccessMessage(false);
  };
  const closeErrorMessage = () => {
    setShowErrorMessage(false);
  };
  return (
    <Box p={5}>
        {showSuccessMessage && (
          <Alert status="success" variant="solid">
            <AlertIcon />
            <AlertTitle mr={2}>Success!</AlertTitle>
            <AlertDescription>Your form has been submitted successfully.</AlertDescription>
            <CloseButton position="absolute" right="8px" top="8px" onClick={closeSuccessMessage} />
          </Alert>
        )}
        {showErrorMessage && (
          <Alert status="error" variant="solid">
            <AlertIcon />
            <AlertTitle mr={2}>Error!</AlertTitle>
            <AlertDescription>Can not apply twice to the same pet.</AlertDescription>
            <CloseButton position="absolute" right="8px" top="8px" onClick={closeErrorMessage} />
          </Alert>
        )}
      <Heading as="h2" size="lg" mb={5}>Apply for Adoption</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="seeker_home_type" isRequired>
          <FormLabel>Home Type</FormLabel>
          <Input name="seeker_home_type" type="text" onChange={handleChange} />
        </FormControl>

        <FormControl id="seeker_yard_size" isRequired mt={4}>
          <FormLabel>Yard Size</FormLabel>
          <Input name="seeker_yard_size" type="text" onChange={handleChange} />
        </FormControl>

        <FormControl id="seeker_pet_care_experience" isRequired mt={4}>
          <FormLabel>Pet Care Experience</FormLabel>
          <Input name="seeker_pet_care_experience" type="text" onChange={handleChange} />
        </FormControl>

        <FormControl id="seeker_previous_pets" isRequired mt={4}>
          <FormLabel>Previous Pets</FormLabel>
          <Input name="seeker_previous_pets" type="text" onChange={handleChange} />
        </FormControl>

        <Button colorScheme="blue" mt={4} type="submit">
          Submit Application
        </Button>
      </form>
    </Box>
  );
};

export default ApplicationForm;
