import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Select,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Textarea,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { API_URL } from '../../constants';

import { useParams } from 'react-router-dom';

const formatDate = (timestamp) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  return new Date(timestamp).toLocaleDateString(undefined, options);
};

const OptionsStyle = {
  border: '5px',
  color: 'black',
};

const ShelterBlogPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [sorting, setSorting] = useState('-date_posted');
  const { authorId } = useParams();
  const [shelterName, setShelterName] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSortingChange = (event) => {
    const selectedSorting = event.target.value;
    setSorting(selectedSorting);
  };

  useEffect(() => {
    const getListOfBlogPosts = async () => {
      try {
        const response = await axios.get(
          `${API_URL}blogs/?ordering=${sorting}&author=${authorId}`
        );
        if (response.status === 200) {
          setBlogPosts(response.data);
          if (response.data.length > 0) {
            setShelterName(response.data[0].shelter_name);
          }
        }
      } catch (error) {
        console.error('ERROR IN RETRIEVING BLOGS: ', error.message);
      }
    };

    getListOfBlogPosts();
  }, [sorting, authorId]);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const [showAlert, setShowAlert] = useState(false);

  const handleCreate = async () => {
    // Validation check
    if (!title || !content || !image) {
      setShowAlert(true);
      return;
    }

    try {
      const accessToken = localStorage.getItem('access_token');

      // Create a FormData object to handle file uploads
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('author', authorId);
      formData.append('likes', 0);
      formData.append('shelter_name', localStorage.getItem('user_name'));
      formData.append('image', image); // Append the image file

      const response = await fetch(`${API_URL}blogs/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData, // Use the FormData object as the body for file uploads
      });

      if (response.status === 201) {
        window.location.reload();
        console.log('Blog post created successfully!');
        onClose();
        // Reset input values for the next post
        setTitle('');
        setContent('');
        setImage(null);
      }
    } catch (error) {
      console.error('Error creating blog post:', error.message);
    }
  };

  return (
    <Box p={4} m={5}>
      <Box
        p={4}
        mb={5}
        bg='#FFFFFF'
        borderWidth='6px'
        borderRadius='md'
        borderColor='#BEE3F8'
      >
        <Heading textAlign='center' color='blue.500'>
          Blog Posts
        </Heading>
        <Text textAlign='center' fontWeight='bold' pt={2}>
          {shelterName
            ? `Explore the latest blog posts from ${shelterName}!`
            : 'This shelter does not have any posts yet...'}
        </Text>
      </Box>
      <Box>
        <GridItem style={OptionsStyle}>
          <Flex align='center'>
            <Select
              value={sorting}
              onChange={handleSortingChange}
              mt={4}
              placeholder='Sort by'
              backgroundColor='#FFFFFF'
              mb={4}
              borderColor='#BEE3F8'
              maxW='200px'
            >
              <option value='-date_posted'>Most Recent</option>
              <option value='date_posted'>Oldest First</option>
              <option value='-likes'>Most Liked</option>
            </Select>

            {localStorage.getItem('is_pet_shelter_user') &&
              localStorage.getItem('user_user') == authorId && (
                <>
                  <Button
                    ml={4}
                    mt={2}
                    mb={3}
                    color='white'
                    bg='green.500'
                    _hover={{ bg: 'green.600' }}
                    fontWeight='bold'
                    onClick={onOpen}
                  >
                    Create Post
                  </Button>

                  <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Create New Post</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <Input
                          type='file'
                          accept='image/*'
                          mb={4}
                          onChange={handleImageChange}
                        />
                        <Input
                          placeholder='Title'
                          mb={4}
                          value={title}
                          onChange={handleTitleChange}
                        />
                        <Textarea
                          placeholder='Content'
                          mb={4}
                          value={content}
                          onChange={handleContentChange}
                        />
                        <Button colorScheme='green' onClick={handleCreate}>
                          Create
                        </Button>
                        {showAlert && (
                          <Alert status='error' mt={4} borderRadius='md'>
                            <AlertIcon />
                            Please provide a title, content, and image before
                            submitting.
                          </Alert>
                        )}
                      </ModalBody>
                    </ModalContent>
                  </Modal>
                </>
              )}
          </Flex>
        </GridItem>
      </Box>
      <Grid templateColumns='repeat(auto-fill, minmax(300px, 1fr))' gap={7}>
        {blogPosts.map((blog_post) => (
          <GridItem key={blog_post.id}>
            <RouterLink
              to={`/shelter_blogs/${blog_post.author}/${blog_post.id}`}
            >
              <Box
                _hover={{
                  bg: '#EDFDFD',
                  transform: 'scale(1.05)',
                  transition: 'transform 0.3s ease',
                }}
                boxShadow='md'
                p={6}
                display='flex'
                flexDirection='column'
                justifyContent='space-between'
                borderWidth='5px'
                borderRadius='md'
                height='450px'
                mb={4}
                bg='#FFFFFF'
                borderColor='#BEE3F8'
              >
                <Text
                  mt={-2}
                  color='blue.500'
                  textAlign='center'
                  fontSize='2xl'
                  fontWeight='bold'
                >
                  {blog_post.title}
                </Text>
                {blog_post.image && (
                  <img
                    src={blog_post.image}
                    alt={blog_post.title}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '150px',
                      objectFit: 'cover',
                      marginTop: '10px',
                    }}
                  />
                )}
                <Text textAlign='center' fontSize='md' fontWeight='bold'>
                  Author: {blog_post.shelter_name}
                </Text>
                <Text textAlign='center' fontSize='sm'>
                  {formatDate(blog_post.date_posted)}
                </Text>
                <Text textAlign='center'>
                  {blog_post.content.slice(0, 50)}...
                </Text>
                <RouterLink
                  to={`/shelter_blogs/${blog_post.author}/${blog_post.id}`}
                >
                  <Text
                    textAlign='center'
                    color='blue.500'
                    mt={2}
                    fontWeight='bold'
                  >
                    Read More | Likes: {blog_post.likes}
                  </Text>
                </RouterLink>
              </Box>
            </RouterLink>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default ShelterBlogPage;
