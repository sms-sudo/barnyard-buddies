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
    HStack,
    Input,
    Link,
    Switch,
    Text,
    VStack,
} from '@chakra-ui/react';

import { useNavigate } from 'react-router-dom';


const RegistrationPage = () => {

    const [registerFormData, setRegisterFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
        avatar: null,
        mission_statement: '',
        address: '',
        phone_number: '',
    });

    const [accountType, setAccountType] = useState('pet_seeker');
    const [requiredRegistrationFields, setRequiredRegistrationFields] = useState([]);
    const [passwordNotMatch, setPasswordNotMatch] = useState(false);
    const [displayWarning, setDisplayWarning] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState(null);


    const requiredRegistrationFieldsMap = {
        pet_seeker: ['name', 'email', 'password', 'password2'],
        pet_shelter: ['name', 'email', 'password', 'password2', 'mission_statement', 'address', 'phone_number'],
    };

    const handleChange = (e) => {
        setRegisterFormData({
            ...registerFormData,
            [e.target.name]: e.target.value,
        });
    };

    const handleToggle = () => {
        setAccountType((prevType) => (prevType === 'pet_seeker' ? 'pet_shelter' : 'pet_seeker'));
    };

    const handleFileChange = (e) => {
        setRegisterFormData({
            ...registerFormData,
            avatar: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredRegistrationFieldsList = requiredRegistrationFieldsMap[accountType];
        if (registerFormData.password !== registerFormData.password2) {
            setPasswordNotMatch(true);
            setDisplayWarning(true);
            setRequiredRegistrationFields(['password', 'password2']);
            return;
        }

        const missingFields = requiredRegistrationFieldsList.filter((field) => !registerFormData[field]);

        if (missingFields.length > 0) {
            setRequiredRegistrationFields(missingFields);
            setDisplayWarning(true);
            return;
        }

        setPasswordNotMatch(false);
        setDisplayWarning(false);

        let api_endpoint = '';

        if (accountType === 'pet_shelter') {
            api_endpoint = 'http://127.0.0.1:8000/accounts/petshelter/';
        } else if (accountType === 'pet_seeker') {
            api_endpoint = 'http://127.0.0.1:8000/accounts/petseeker/';
        }

        const requestData = {
            email: registerFormData.email,
            password: registerFormData.password,
            password2: registerFormData.password2,
            name: registerFormData.name,
            ...(accountType === 'pet_seeker' && {
                avatar: registerFormData.avatar,
            }),
            ...(accountType === 'pet_shelter' && {
                mission_statement: registerFormData.mission_statement,
                address: registerFormData.address,
                phone_number: registerFormData.phone_number,
            }),
        };

        try {
            const resp = await axios.post(api_endpoint, requestData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/login');
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.error);
            } else {
                setError('ERROR WHICH IS UNKNOWN HAS TAKEN PLACE');
            }
        }
    };

    return (
        <Container mb={10} p={4}>
            <Box bg="#FFFFFF" borderColor='#BEE3F8' mt={5} mb={5} borderWidth="8px" borderRadius="lg" p={3}>
                <VStack>
                    <Heading textAlign="center">
                        Register a <Text color="blue.500">Barnyard Buddies</Text> Account
                    </Heading>
                    <Text fontsize="md" align="center" pb={4}>Already have an account? <Link color="blue.500" href="/login">Log In</Link></Text>
                    {displayWarning && (
                        <Alert status="error" borderRadius="lg" mb={3}>
                            <AlertIcon />
                            {passwordNotMatch ? (
                                <span>Password fields do not match.</span>
                            ) : (
                                <span>The following fields are required: {requiredRegistrationFields.join(', ')}</span>
                            )}
                        </Alert>
                    )}
                    {error && (
                        <Alert status="error" mb={3}>
                            <AlertIcon />
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <FormControl display="flex" alignItems="center" mb={2}>
                            <FormLabel>Register as Pet Shelter</FormLabel>
                            <Switch
                                colorScheme="blue"
                                isChecked={accountType === 'pet_shelter'}
                                onChange={handleToggle}
                            />
                        </FormControl>
                        {accountType === 'pet_seeker' && (
                            <>
                                <FormControl mb={3}>
                                    <FormLabel>Pet Seeker Name:</FormLabel>
                                    <Input
                                        type="text"
                                        name="name"
                                        placeholder="Enter your name..."
                                        value={registerFormData.name}
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </>
                        )}
                        {accountType === 'pet_shelter' && (
                            <>
                                <FormControl mb={3}>
                                    <FormLabel>Pet Shelter Name:</FormLabel>
                                    <Input
                                        type="text"
                                        name="name"
                                        placeholder="Enter your shelter's name..."
                                        value={registerFormData.name}
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </>
                        )}

                        <FormControl mb={3}>
                            <FormLabel>Email:</FormLabel>
                            <Input
                                type="email"
                                name="email"
                                placeholder="Enter your email..."
                                value={registerFormData.email}
                                onChange={handleChange}
                            />
                        </FormControl>

                        <HStack>
                            <FormControl mb={3}>
                                <FormLabel>Password:</FormLabel>
                                <Input
                                    type="password"
                                    name="password"
                                    value={registerFormData.password}
                                    onChange={handleChange}
                                />
                            </FormControl>

                            <FormControl mb={3}>
                                <FormLabel>Confirm Password:</FormLabel>
                                <Input
                                    type="password"
                                    name="password2"
                                    value={registerFormData.password2}
                                    onChange={handleChange}
                                />
                            </FormControl>
                        </HStack>
                        {accountType === 'pet_seeker' && (
                            <>
                                <FormControl mb={3}>
                                    <FormLabel>Profile Picture:</FormLabel>
                                    <Input p={1}
                                        type="file"
                                        name="avatar"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </FormControl>
                            </>
                        )}


                        {accountType === 'pet_shelter' && (
                            <>
                                <FormControl mb={3}>
                                    <FormLabel>Mission Statement:</FormLabel>
                                    <Input
                                        type="text"
                                        name="mission_statement"
                                        placeholder="Enter your shelter's mission statement..."
                                        value={registerFormData.mission_statement}
                                        onChange={handleChange}
                                    />
                                </FormControl>

                                <FormControl mb={3}>
                                    <FormLabel>Address:</FormLabel>
                                    <Input
                                        type="text"
                                        name="address"
                                        placeholder="Enter your shelter's address..."
                                        value={registerFormData.address}
                                        onChange={handleChange}
                                    />
                                </FormControl>

                                <FormControl mb={3}>
                                    <FormLabel>Phone Number:</FormLabel>
                                    <Input
                                        type="text"
                                        name="phone_number"
                                        placeholder="Enter your shelter's phone number..."
                                        value={registerFormData.phone_number}
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </>
                        )}
                        <Center>
                            <Button colorScheme="blue" type="submit">
                                Register User
                            </Button>
                        </Center>
                    </form>
                </VStack>
            </Box>
        </Container>
    );
};

export default RegistrationPage;
