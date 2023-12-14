import React, { useState, useEffect } from 'react';
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Container,
    Center,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Text,
    VStack,
} from '@chakra-ui/react';
import axios from 'axios';


const UpdatePetPalUser = () => {

    const [isPetShelter, setIsPetShelter] = useState(true);
    const [updateFormData, setUpdateFormData] = useState({
        id: '',
        user: '',
        name: '',
        password: '',
        password2: '',
        avatar: null,
        mission_statement: '',
        address: '',
        phone_number: '',
    });
    const [displayUpdateSuccessMsg, setDisplayUpdateSuccessMsg] = useState(false);
    const [addAvatar, setAddAvatar] = useState(false)
    const [passwordNotMatch, setPasswordNotMatch] = useState(false);
    const [displayWarning, setDisplayWarning] = useState(false);

    useEffect(() => {
        const getCurrentUserInfo = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/accounts/user/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });
                if (response.status === 200) {
                    const userInfo = response.data;
                    console.log("THE USER DATA", userInfo)
                    setUpdateFormData((prevUpdateFormData) => ({
                        ...prevUpdateFormData,
                        ...userInfo,
                    }));
                    const getPetShelterBool = localStorage.getItem('is_pet_shelter_user');
                    if (getPetShelterBool !== null) {
                        const parsedPetShelterBool = JSON.parse(getPetShelterBool);
                        setIsPetShelter(parsedPetShelterBool);
                    }
                } else {
                    console.log("1", response)
                }
            } catch (error) {
                console.log("2", error)
            }
        };
        getCurrentUserInfo();
    }, []);

    const handleAddInfo = (e) => {
        setUpdateFormData({
            ...updateFormData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFile = (e) => {
        setUpdateFormData({
            ...updateFormData,
            avatar: e.target.files[0],
        });
        setAddAvatar(true)
        // console.log("HANDLE FILE", updateFormData.avatar)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (updateFormData.password !== updateFormData.password2) {
            setDisplayUpdateSuccessMsg(false)
            setPasswordNotMatch(true);
            setDisplayWarning(true);
            return;
        }
        setPasswordNotMatch(false);
        setDisplayWarning(false);

        let api_endpoint = '';

        if (isPetShelter) {
            api_endpoint = `http://127.0.0.1:8000/accounts/petshelter/${updateFormData.id}/`;
        } else {
            api_endpoint = `http://127.0.0.1:8000/accounts/petseeker/${updateFormData.id}/`;
        }

        const requestData = {
            name: updateFormData.name,
        };

        if (updateFormData.password.trim() !== '') {
            requestData.new_password = updateFormData.password;
        }

        if (updateFormData.password2.trim() !== '') {
            requestData.new_password2 = updateFormData.password2;
        }

        if (isPetShelter) {
            requestData.mission_statement = updateFormData.mission_statement
            requestData.address = updateFormData.address
            requestData.phone_number = updateFormData.phone_number
        } else {
            if (addAvatar) {
                requestData.avatar = updateFormData.avatar
            }
        }

        try {
            const bearer_token = localStorage.getItem('access_token')
            console.log("request data being sent to update endpoint", requestData)
            const response = await axios.put(api_endpoint, requestData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${bearer_token}`,
                },
            });
            if (response.status === 200) {
                console.log('update success');
                setDisplayUpdateSuccessMsg(true);
            } else {
                console.error('update fail');
                console.log("3", response)
            }

        } catch (error) {
            if (error.response && error.response.data) {
                console.log("4", error.response)
                console.log("5", error.response.data)
            } else {
                console.log("6", error)
            }
        }
    };
    return (
        <Container mb={10} p={4}>
            <Box bg="#FFFFFF" borderColor='#BEE3F8' borderWidth="8px" borderRadius="lg" p={8}>
                <VStack>
                    <Heading textAlign="center">
                        Update your <Text color="blue.500">Barnyard Buddies</Text> Account
                    </Heading>
                    {displayUpdateSuccessMsg && <Box fontWeight="bold" color="#48BB78">Account Updated!</Box>}
                    {displayWarning && (
                        <Alert status="error" borderRadius="lg" mb={3}>
                            <AlertIcon />
                            {passwordNotMatch && (
                                <span>Password fields do not match.</span>
                            )}
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit}>
                        {!isPetShelter && (
                            <>
                                <FormControl mb={3}>
                                    <FormLabel>Pet Seeker Name:</FormLabel>
                                    <Input
                                        type="text"
                                        name="name"
                                        value={updateFormData.name}
                                        onChange={handleAddInfo}
                                    />
                                </FormControl>
                            </>
                        )}
                        {isPetShelter && (
                            <>
                                <FormControl mb={3}>
                                    <FormLabel>Pet Shelter Name:</FormLabel>
                                    <Input
                                        type="text"
                                        name="name"
                                        value={updateFormData.name}
                                        onChange={handleAddInfo}
                                    />
                                </FormControl>
                            </>
                        )}
                        <HStack>
                            <FormControl mb={3}>
                                <FormLabel>Password:</FormLabel>
                                <Input
                                    type="password"
                                    name="password"
                                    value={updateFormData.password}
                                    onChange={handleAddInfo}
                                />
                            </FormControl>
                            <FormControl mb={3}>
                                <FormLabel>Confirm Password:</FormLabel>
                                <Input
                                    type="password"
                                    name="password2"
                                    value={updateFormData.password2}
                                    onChange={handleAddInfo}
                                />
                            </FormControl>
                        </HStack>
                        {!isPetShelter && (
                            <>
                                <FormControl mb={3}>
                                    <FormLabel>Profile Picture:</FormLabel>
                                    <Input p={1}
                                        type="file"
                                        name="avatar"
                                        accept="image/*"
                                        onChange={handleFile}
                                    />
                                </FormControl>
                            </>
                        )}
                        {isPetShelter && (
                            <>
                                <FormControl mb={3}>
                                    <FormLabel>Mission Statement:</FormLabel>
                                    <Input
                                        type="text"
                                        name="mission_statement"
                                        value={updateFormData.mission_statement}
                                        onChange={handleAddInfo}
                                    />
                                </FormControl>

                                <FormControl mb={3}>
                                    <FormLabel>Address:</FormLabel>
                                    <Input
                                        type="text"
                                        name="address"
                                        value={updateFormData.address}
                                        onChange={handleAddInfo}
                                    />
                                </FormControl>

                                <FormControl mb={3}>
                                    <FormLabel>Phone Number:</FormLabel>
                                    <Input
                                        type="text"
                                        name="phone_number"
                                        value={updateFormData.phone_number}
                                        onChange={handleAddInfo}
                                    />
                                </FormControl>
                            </>
                        )}
                        <Center>
                            <Button colorScheme="blue" type="submit">
                                Update Your Account Information
                            </Button>
                        </Center>
                    </form>
                </VStack>
            </Box>
        </Container>
    );
};

export default UpdatePetPalUser;
