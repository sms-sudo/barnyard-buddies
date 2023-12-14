import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import defaultImage from "../../assests/default.png"
import { FetchShelter } from '../../hooks/FetchShelter';
import { DeleteIcon } from '@chakra-ui/icons';
import { 
    Card, 
    CardBody, 
    Image, 
    Heading, 
    Text, 
    Divider, 
    ButtonGroup, 
    Stack,
    Button,
    CardFooter,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,

  } from '@chakra-ui/react';
import PetListingForm from '../petListings/CreateUpdateListing';
import PropTypes from 'prop-types';


function PetListingCard(pet){

    const navigate = useNavigate();
    const imageUrl = pet.avatar || defaultImage;
    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
    const formRef = useRef();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const shelter = FetchShelter(pet.shelter)

    const submitForm = () => {
        setIsSubmitting(true);
        formRef.current.submitForm(); // This will trigger onSubmit in the form
      };
    
      const onFormSubmitSuccess = () => {
        setShowSuccessMessage(true);
        onModalClose();
        // Other success handling logic...
      };
      const closeSuccessMessage = () => {
        setShowSuccessMessage(false);
      };
    
      const handleDelete = async () => {
        const petId = pet.id; // Assuming 'pet.id' contains the ID of the pet listing
        const queryString = `http://127.0.0.1:8000/petListing/${petId}/`;
    
        try {
            const accessToken = localStorage.getItem('access_token');
            await axios.delete(queryString, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            

    
            // Handle successful deletion
            console.log(`Pet listing with ID ${petId} deleted successfully`);
            // You might want to update the UI or redirect the user
            document.location.reload(true)
        } catch (error) {
            console.error('Error deleting pet listing:', error);
            // Handle any errors, such as displaying a message to the user
        }
    };
    
    

    const canEdit = () => {
        return (pet.shelter == localStorage.getItem('user_id') && (localStorage.getItem('is_pet_shelter_user') == "true"))
    }
    

    const handleMoreInfoClick = (petId) => {
        navigate(`/pet-details/${petId}`);
    };

    return (
        <>
        <Card maxW='sm'>
        <CardBody>
        <div>
            
            <Modal
              isOpen={isModalOpen}
              onClose={() => {
                onModalClose();
                setIsSubmitting(false);
              }}
              size={'full'}
            >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Update Pet Listing</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                <PetListingForm
                    onFormSubmitSuccess={onFormSubmitSuccess}
                    predefinedValues={{
                        name: pet.name,
                        breed: pet.breed,
                        age: pet.age,
                        size: pet.size,
                        color: pet.color,
                        gender: pet.gender,
                        description: pet.description,
                        characteristics: pet.characteristics,
                        status: pet.status,
                        avatar: null,
                        petId: pet.id

                    }}
                    ref={formRef}
                />
                </ModalBody>

                <ModalFooter>
                <Button onClick={submitForm} colorScheme='blue' mr={3}>
                    Submit Form
                </Button>
                <Button onClick={onModalClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
            </Modal>
        </div>
            <Image
            src={imageUrl}
            alt={pet.name || 'Pet'}
            borderRadius='lg'
            />
            <Stack mt='6' spacing='3'>
            <Heading size='md'>{pet.name}</Heading>
            <Text>
                Age: {pet.age}, {pet.breed}
            </Text>
            <Text color='blue.600' fontSize='2xl'>
                Shelter Location: {shelter}
            </Text>
            </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
            <ButtonGroup spacing='2'>
            <Button variant='solid' colorScheme='blue' onClick={() => handleMoreInfoClick(pet.id)}>
                More info
            </Button>
            {canEdit() && (
            <>
                <Button variant='ghost' colorScheme='blue' onClick={onModalOpen}>
                    Edit Pet Info
                </Button>
                <Button variant='ghost' colorScheme='red' onClick={handleDelete}>
                    <DeleteIcon mr={2} />
                    Delete
                </Button>
            </>
            )}

            
            </ButtonGroup>
        </CardFooter>
        </Card>
        </>
    )
}

// PetListingCard.propTypes = {
//     pet: PropTypes.shape({
//       name: PropTypes.string.isRequired,
//       breed: PropTypes.string.isRequired,
//       age: PropTypes.number.isRequired,
//       shelter: PropTypes.number.isRequired, // You might want to define this object more specifically
//       avatar: PropTypes.string // Assuming this is a URL
//     }).isRequired,
//   };
export default PetListingCard