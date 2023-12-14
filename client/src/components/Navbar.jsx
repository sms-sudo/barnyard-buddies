import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Spacer,
  Stack,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, BellIcon } from '@chakra-ui/icons';
import logoImage from './logo.png';
import { Link } from 'react-router-dom';
import NotificationDrawer from './notifications/notificationDrawer';
import PetListingForm from './petListings/CreateUpdateListing';
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Links = [
  { label: 'Search Pets', to: '/pet-listings' },
  { label: 'Shelters', to: '/pet_shelters' },
  { label: 'Shelter Blogs', to: '/shelter_blogs' },
  { label: 'Account Information', to: '/account-information' },
];

const NotLoggedInLinks = [
  { label: 'Search Pets', to: '/pet-listings' },
  { label: 'Shelters', to: '/pet_shelters' },
  { label: 'Shelter Blogs', to: '/shelter_blogs' },
  { label: 'Register', to: '/register' },
  { label: 'Login', to: '/login' },
];

const NavLink = (props) => {
  const { children } = props;

  return (
    <Box
      as='a'
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: 'rgb(255, 255, 255, 0.36)',
      }}
      href={'#'}
    >
      {children}
    </Box>
  );
};

export default function Simple() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const formRef = useRef();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddListingButton, setShowAddListingButton] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { isTokenPresent } = useAuth();

  const fetchnotifications = async () => {
    const queryString = 'http://127.0.0.1:8000/notifications/';

    try {
      const response = await axios.get(queryString, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      });

      const notificationData = response.data.results.map((notification) => ({
        id: notification.id,
        message: notification.message,
        time: notification.created_at,
        recipient_id: notification.recipient_id,
        isRead: notification.is_read,
      }));
      setNotifications(notificationData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (isTokenPresent()) {
      fetchnotifications();
    }
  }, []);

  const submitForm = () => {
    setIsSubmitting(true);
    formRef.current.submitForm(); // This will trigger onSubmit in the form
  };

  const onFormSubmitSuccess = () => {
    setShowSuccessMessage(true);
    onModalClose();
    // Other success handling logic...
  };

  useEffect(() => {
    const canAddListing = () => {
      const isPetShelterUser =
        localStorage.getItem('is_pet_shelter_user') == 'true';
      return isPetShelterUser;
    };

    setShowAddListingButton(canAddListing());
  }, []);
  const closeSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  const imageStyle = {
    width: '25%', // Set the width to 100%
    height: '50%', // Set the height to 100%
  };
  return (
    // {useColorModeValue('gray.100', 'gray.900')}
    <>
      <Box bg='#BEE3F8' px={4} py={2}>
        <Flex
          h={16}
          alignItems={'center'}
          justifyContent={'space-between'}
          fontWeight={'bold'}
          fontSize='xl'
          color={'#2B6CB0'}
        >
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box mr='auto' px={0} alignItems={'center'}>
              <Image
                src={logoImage}
                alt='Logo'
                boxSize='80px'
                objectFit='cover'
              />
            </Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {isTokenPresent() ? (
                <>
                  {Links.map(({ label, to }) => (
                    <NavLink key={label}>
                      <Link to={to}>{label}</Link>
                    </NavLink>
                  ))}
                </>
              ) : (
                <>
                  {NotLoggedInLinks.map(({ label, to }) => (
                    <NavLink key={label}>
                      <Link to={to}>{label}</Link>
                    </NavLink>
                  ))}
                </>
              )}
            </HStack>
            {isTokenPresent() && showAddListingButton && (
              <Button
                color='blue.500'
                fontWeight={'bold'}
                fontSize='xl'
                onClick={onModalOpen}
              >
                Add Pet Listing
              </Button>
            )}
            {isTokenPresent() && (
              <>
                <BellIcon boxSize={31} cursor='pointer' onClick={onOpen} />
                <NotificationDrawer
                  notificationList={notifications}
                  isOpen={isOpen}
                  onClose={onClose}
                />
              </>
            )}
          </HStack>
        </Flex>

        {isOpen ? (
          <Box pb={4} color='white' display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {isTokenPresent() ? (
                <>
                  {Links.map(({ label, to }) => (
                    <NavLink key={label}>
                      <Link to={to}>{label}</Link>
                    </NavLink>
                  ))}
                </>
              ) : (
                <>
                  {NotLoggedInLinks.map(({ label, to }) => (
                    <NavLink key={label}>
                      <Link to={to}>{label}</Link>
                    </NavLink>
                  ))}
                </>
              )}
            </Stack>
          </Box>
        ) : null}
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
              <ModalHeader>Create a Pet Listing</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <PetListingForm
                  onFormSubmitSuccess={onFormSubmitSuccess}
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
        {showSuccessMessage && (
          <Alert status='success' variant='solid'>
            <AlertIcon />
            <AlertTitle mr={2}>Success!</AlertTitle>
            <AlertDescription>
              Your form has been submitted successfully.
            </AlertDescription>
            <CloseButton
              position='absolute'
              right='8px'
              top='8px'
              onClick={closeSuccessMessage}
            />
          </Alert>
        )}
      </Box>
    </>
  );
}
