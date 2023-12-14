import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Input, Button, Flex, Badge, Text, Grid } from '@chakra-ui/react';
import Message from '../../components/comments/Message';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const ConversationPage = () => {
  const [newContent, setNewContent] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [application, setApplications] = useState();
  const [hasMore, setHasMore] = useState(true);
  const { appId } = useParams();
  const conversationBoxRef = useRef(null);
  const loadingMore = useRef(false);
  const isMounted = useRef(true); // Ref to track component mount state

  useEffect(() => {
    // Fetch messages and comments when the component mounts
    fetchMessages();
  }, [currentPage]);
  
  useEffect(() => {
    // Fetch messages and comments when the component mounts
    fetchApplication();
  }, [appId]);// Trigger fetch when currentPage changes

  useEffect(() => {
    // Scroll to the bottom of the conversation box when new messages are added
    if (conversationBoxRef.current) {
      conversationBoxRef.current.scrollTop =
        conversationBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const accounts_url = 'http://127.0.0.1:8000/';
      const pet_seeker_detail_get_endpoint =
        accounts_url + `comments/applications/${appId}/?page=${currentPage}`;

      const response = await axiosInstance.get(pet_seeker_detail_get_endpoint);

      console.log(response.data.results);

      // Append new messages to the existing ones
      setMessages((prevMessages) =>
        currentPage === 1
          ? response.data.results
          : [...prevMessages, ...response.data.results]
      );

      // Check if there are more pages
      setHasMore(response.data.next !== null);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchApplication = async () => {
    try {
      const url = `http://127.0.0.1:8000/applications/${appId}/`;


      const response = await axiosInstance.get(url);

      console.log(response.data);
      setApplications(response.data);
      console.log(application);


    } catch (error) {
      console.error('Error fetching Applications:', error);
    }
  };

  const handleSendContent = async () => {
    try {
      const accounts_url = 'http://127.0.0.1:8000/';
      const pet_seeker_detail_get_endpoint =
        accounts_url + `comments/applications/${appId}/`;
      const user_user = localStorage.getItem('user_user');
      const user_id = localStorage.getItem('user_id');
      const user_name = localStorage.getItem('user_name');
      const is_pet_shelter_user = localStorage.getItem('is_pet_shelter_user');

      let payload;

      if (is_pet_shelter_user === 'true') {
        payload = {
          comment_made_by_the_user: user_user,
          object_id: appId,
          content_type: appId,
          comment_text: newContent,
          comment_made_by_the_id_pet_seeker: null,
          comment_made_by_the_id_pet_shelter: user_id,
          rating: null,
          is_application: true,
          name: user_name,
        };
      } else {
        payload = {
          comment_made_by_the_user: user_user,
          object_id: appId,
          content_type: appId,
          comment_text: newContent,
          comment_made_by_the_id_pet_seeker: user_id,
          comment_made_by_the_id_pet_shelter: null,
          rating: null,
          is_application: true,
          name: user_name,
        };
      }

      await axiosInstance.post(pet_seeker_detail_get_endpoint, payload);
      window.location.reload();
      setNewContent('');
    } catch (error) {
      console.error('Error sending content:', error);
    }
  };

  const handleScroll = useCallback(() => {
    if (
      conversationBoxRef.current.scrollTop +
        conversationBoxRef.current.clientHeight ===
        conversationBoxRef.current.scrollHeight &&
      hasMore
    ) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [hasMore]);

  useEffect(() => {
    const debouncedHandleScroll = debounce(handleScroll, 200);
    const currentRef = conversationBoxRef.current;

    if (currentRef) {
      currentRef.addEventListener('scroll', debouncedHandleScroll);

      return () => {
        currentRef.removeEventListener('scroll', debouncedHandleScroll);
      };
    }
  }, [handleScroll]);
  
  const handleStatusChange = async (newStatus) => {
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/applications/status/${application.id}/`, {
        status: newStatus
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
  
      });
  
      if (response.status === 200) {
        console.log(`Application status updated to ${newStatus}`);
        // You can add more logic here to update the UI or redirect the user
      }
    } catch (error) {
      console.error(`Error updating application status:`, error);
      // Handle the error - show an error message, etc.
    }
  };
  

  const handleWithdraw = () => {
    handleStatusChange('withdrawn');
  };
  
  const handleDeny = () => {
    handleStatusChange('denied');
  };
  
  const handleApprove = () => {
    handleStatusChange('accepted');
  };

  return (
    <>
    
    
    {application && (
  <Box p={4} borderWidth="1px" borderRadius="lg" overflow="hidden">
  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
  <Flex align="center">
    <Text fontWeight="bold" mr={2}>Pet Name:</Text>
    <Text>{application.pet_name}</Text>
  </Flex>

  <Flex align="center">
    <Text fontWeight="bold" mr={2}>Seeker Name:</Text>
    <Text>{application.seeker_name}</Text>
  </Flex>

  <Flex align="center">
    <Text fontWeight="bold" mr={2}>Home Type:</Text>
    <Text>{application.seeker_home_type}</Text>
  </Flex>

  <Flex align="center">
    <Text fontWeight="bold" mr={2}>Yard Size:</Text>
    <Text>{application.seeker_yard_size}</Text>
  </Flex>

  <Flex align="center">
    <Text fontWeight="bold" mr={2}>Pet Care Experience:</Text>
    <Text>{application.seeker_pet_care_experience}</Text>
  </Flex>

  <Flex align="center">
    <Text fontWeight="bold" mr={2}>Previous Pets:</Text>
    <Text>{application.seeker_previous_pets}</Text>
  </Flex>

  <Flex gridColumn="span 2" align="center">
    <Text fontWeight="bold" mr={2}>Status:</Text>
    <Badge colorScheme={application.status === 'pending' ? 'orange' : application.status === 'accepted' ? 'green' : 'red'}>
      {application.status}
    </Badge>
  </Flex>
    {(localStorage.getItem('is_pet_shelter_user') === 'false') &&(<Button colorScheme='teal' variant='outline' onClick={() => handleWithdraw(application.id)}>
                  withdraw application
    </Button>)}
    {(localStorage.getItem('is_pet_shelter_user') == 'true')&&(<Button colorScheme='red' variant='outline' onClick={() => handleDeny(application.id)}>
                  Deny
    </Button>)}
    {(localStorage.getItem('is_pet_shelter_user') == 'true')&&(<Button colorScheme='teal' variant='outline' onClick={() => handleApprove(application.id)}>
                  Approve
    </Button>)}
</Grid>


  </Box>
)}
    <Flex
      direction='column'
      align='flex-start'
      p={4}
      maxW={['100%', '100%', '800px']}
      width='100%'
      mx='auto'
      mt={8}
      bg='gray.100'
      borderRadius='md'
      padding={['10px', '20px']}
      overflowY='auto'
      maxHeight='500px'
      onScroll={handleScroll}
      ref={conversationBoxRef}
    >
      {Array.isArray(messages) &&
        messages.map((message, index) => (
          <Message
            key={index}
            text={message.comment_text}
            timestamp={message.comment_creation_time}
            sender={message.comment_made_by_the_id_pet_seeker === null}
            shelterName={message.name}
          />
        ))}

      <Flex mt={4} width='100%'>
        <Input
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder='Type your message/comment...'
          flex='1'
          mr={2}
          borderColor='black'
          textColor='black'
          onScroll={handleScroll}
          ref={conversationBoxRef}
        />
        <Button colorScheme='blue' onClick={handleSendContent}>
          Send
        </Button>
      </Flex>
    </Flex>
  </>
  );
};

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default ConversationPage;
