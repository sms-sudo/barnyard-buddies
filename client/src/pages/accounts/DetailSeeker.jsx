// This Pet Seeker Detail is to be viewed by a Pet Shelter who the Pet Seeker  
// has an application regarding one of the Pet Shelter's listings
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Center,
    Container,
    Heading,
    Image,
    Text,
    VStack,
} from '@chakra-ui/react';
import axios from 'axios';

const PetSeekerDetailPage = () => {
    const { petSeekerID } = useParams();
    const [petSeekerInfo, setPetSeekerInfo] = useState(null);

    useEffect(() => {
        const getPetSeekerInfo = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/accounts/petseeker/${petSeekerID}/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });
                if (response.status === 200) {
                    const seekerInfoDataResponse = response.data;
                    setPetSeekerInfo(seekerInfoDataResponse);
                    console.log("SEEKER INFO", seekerInfoDataResponse)

                } else {
                    console.error('ERROR WHEN GETTING SEEKER INFO');
                    console.log("1", response)
                }
            } catch (error) {
                console.error('USER WHEN GETTING SEEKER INFO 2, ', error);
                console.log("2", error)
            }
        };
        getPetSeekerInfo();
    }, [petSeekerID]);

    if (!petSeekerInfo) {
        return (
            <Box p={4}>
                <Text>Retrieving pet seeker data. Please wait.</Text>
            </Box>
        );
    }

    let backendURL = 'http://127.0.0.1:8000/'

    return (
        <Container>
            <Box m={10} bg="#FFFFFF" mb={10} borderWidth="8px" borderRadius="lg" p={4}>
                <Text mb={3} textAlign="center" color="blue.500" fontSize='xl' fontWeight="bold"> Pet Seeker Information</Text>
                <Center>
                    <VStack mb={5}>
                        <Text fontWeight="bold">Name: </Text>
                        <Text textAlign="center">{petSeekerInfo.name}</Text>
                    </VStack>
                </Center>
                <Center>
                    {petSeekerInfo.avatar && (
                        <Box mt={4} borderRadius="full"
                            overflow="hidden"
                            boxSize="270px" borderWidth="2px"  >
                            <Image objectFit="cover" mb={3} src={backendURL + petSeekerInfo.avatar} alt={`Profile of ${petSeekerInfo.name}`} width="100%" height="100%" />
                        </Box>)}
                </Center>

            </Box>
        </Container>
    );
};

export default PetSeekerDetailPage;
