import React from 'react';
import PropTypes from 'prop-types';
import { 
    Card, 
    CardBody, 
    Heading, 
    Text, 
    Divider, 
    Button,
    CardFooter,
    Stack,
  } from '@chakra-ui/react';
import { useNavigate,Navigate } from 'react-router-dom';


function ApplicationCard({ application }) {

    const nav = useNavigate();
    const handleClick = (id) =>{
        nav(`/application/${id}`)
    }
    return (
        <Card maxW='sm' marginTop={'20px'} marginLeft={'20px'}>
            <CardBody>
                <Stack mt='6' spacing='3'>
                    <Heading size='md'>Application for {application.pet_name}</Heading>
                    <Text fontSize='md'>Status: {application.status}</Text>
                    <Text fontSize='md'>Applicant: {application.seeker_name}</Text>
                    {/* Add more details if needed */}
                </Stack>
            </CardBody>
            <Divider />
            <CardFooter>
                <Button colorScheme='teal' variant='outline' onClick={() => handleClick(application.id)}>
                     View Application
                </Button>
            </CardFooter>
        </Card>
    );
}

ApplicationCard.propTypes = {
    application: PropTypes.shape({
      status: PropTypes.oneOf(['pending', 'accepted', 'denied', 'withdrawn']).isRequired,
      pet_seeker: PropTypes.number,
      pet_listing: PropTypes.number,
      seeker_home_type: PropTypes.string,
      seeker_yard_size: PropTypes.string,
      seeker_pet_care_experience: PropTypes.string,
      seeker_previous_pets: PropTypes.string,
      seeker_name: PropTypes.string ,
      pet_name: PropTypes.string
      // Include any other fields you might want to display
    }).isRequired,
};

export default ApplicationCard;
