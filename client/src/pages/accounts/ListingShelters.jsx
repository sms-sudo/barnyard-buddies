import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    GridItem,
    Heading,
    Link,
    Text,
} from '@chakra-ui/react';



const ListingPetSheltersPage = () => {
    const [petShelters, setPetShelters] = useState([]);
    useEffect(() => {
        const getListOfPetShelters = async () => {
            try {
                let accounts_url = 'http://127.0.0.1:8000/accounts/'
                let pet_shelter_get_endpoint = accounts_url + 'petshelter/'
                const resp = await fetch(pet_shelter_get_endpoint);
                if (resp.ok) {
                    const petSheltersData = await resp.json();
                    setPetShelters(petSheltersData);
                }
            } catch (error) {
                console.error('ERROR IN RETRIEVING PET SHELTERS: ', error.message);
            }
        };
        getListOfPetShelters();
    
    }, []);


    return (
        <Box p={4} m={5}>
            <Box p={4} mb={5} bg="#FFFFFF" borderWidth="6px" borderRadius="md" borderColor="#BEE3F8">
                <Heading textAlign="center" color="blue.500">Pet Shelters</Heading>
                <Text textAlign="center" fontWeight="bold">Click on a Pet Shelter to learn more about them</Text>
            </Box>
            <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={7}>
                {petShelters.map((pet_shelter) => (
                    <GridItem key={pet_shelter.id}>
                        <Link _hover={{ textDecoration: 'none' }} href={`/pet_shelters/${pet_shelter.id}`}>
                            <Box _hover={{
                                bg: "#EDFDFD",
                                transform: 'scale(1.05)',
                                transition: 'transform 0.3s ease',
                            }} boxShadow="md" p={5} display="flex" flexDirection="column" justifyContent="center" borderWidth="5px" borderRadius="md" height="250px" mb={2} bg="#FFFFFF" borderColor="#BEE3F8" >
                                <Text mt={-2} color="blue.500" textAlign="center" fontSize="3xl" fontWeight="bold">{pet_shelter.name}</Text>
                                <Text textAlign="center" fontSize="md" mt={4} fontWeight="bold">Shelter Location</Text>
                                <Text textAlign="center" fontSize="md" mt={2}>{pet_shelter.address}</Text>
                            </Box>
                        </Link>
                    </GridItem>
                ))}
            </Grid>
        </Box >
    );
};

export default ListingPetSheltersPage;
