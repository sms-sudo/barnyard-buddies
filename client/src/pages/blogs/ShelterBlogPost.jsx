import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Image,
  Badge,
  Flex,
  IconButton,
  useColorMode,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { AiFillHeart } from 'react-icons/ai';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_URL } from '../../constants';

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

const BlogPost = () => {
  const { colorMode } = useColorMode();
  const { blogId, authorId } = useParams();
  const [blogPost, setBlogPost] = useState({});
  const [isLiked, setIsLiked] = useState(false);
  const [isShelter, setIsShelter] = useState(false);
  const [isUser, setIsUser] = useState(true);

  const handleLike = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        setIsUser(false);
        return;
      }
      setIsUser(true);

      setIsLiked((prevIsLiked) => !prevIsLiked);
      setBlogPost((prevBlogPost) => ({
        ...prevBlogPost,
        likes: prevBlogPost.likes + (isLiked ? -1 : 1),
      }));
      const payload = { likes: 1 };
      const is_pet_shelter_user = localStorage.getItem('is_pet_shelter_user');
      setIsShelter(is_pet_shelter_user);

      // Send the request to the server
      const response = await fetch(`${API_URL}blogs/${blogId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Revert the local state if the request fails
        setIsLiked((prevIsLiked) => !prevIsLiked);
        console.error('Error in liking blog post:', response.statusText);
      } else {
        // Update localStorage to persist like status
        localStorage.setItem(`liked_${blogId}`, isLiked ? 'true' : 'false');
      }
    } catch (error) {
      console.error('Error in liking blog post:', error.message);
    }
  };

  useEffect(() => {
    const getPostDetails = async () => {
      try {
        const response = await axios.get(
          `${API_URL}blogs/posts/${blogId}/`
        );
        if (response.status === 200) {
          setBlogPost(response.data);

          // Check if the current user has liked the post
          const accessToken = localStorage.getItem('access_token');
          const currentUserID = accessToken
            ? JSON.parse(atob(accessToken.split('.')[1])).user_id
            : null;

          // Set isLiked based on whether the current user is in liked_by_users
          setIsLiked(response.data.liked_by_users.includes(currentUserID));
        }
      } catch (error) {
        console.error('ERROR IN RETRIEVING BLOGS: ', error.message);
      }
    };

    getPostDetails();
  }, [blogId]);

  const handleDelete = async (blogId) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}blogs/${blogId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      window.location.reload();
      if (response.status === 204) {
        console.log('Blog post deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting blog post:', error.message);
    }
  };

  return (
    <Box
      borderRadius='xl'
      overflow='hidden'
      boxShadow='md'
      p={6}
      mb={8}
      bg={colorMode === 'light' ? 'white' : 'gray.800'}
      border='1px solid'
      borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
    >
      {!isUser && (
        <Alert status='error' variant='subtle'>
          <AlertIcon />
          Please log in to like posts
        </Alert>
      )}
      <Text fontSize='3xl' fontWeight='bold' mb={2} color='blue.500'>
        {blogPost.title}
      </Text>
      {localStorage.getItem('is_pet_shelter_user') &&
        localStorage.getItem('user_user') == authorId && (
          <Link to={`/shelter_blogs/${blogPost.author}`}>
            <Button
              mt={2}
              mb={4}
              color='white'
              bg='red.500'
              _hover={{ bg: 'red.600' }}
              fontWeight='bold'
              onClick={() => handleDelete(blogPost.id)}
            >
              Delete
            </Button>
          </Link>
        )}

      <Text fontSize='md' color='gray.500' mb={4}>
        Posted on {formatDate(blogPost.date_posted)}
      </Text>
      {blogPost.image && (
        <Image
          src={blogPost.image}
          alt={blogPost.title}
          mb={4}
          maxH='300px'
          objectFit='cover'
          borderRadius='md'
        />
      )}
      <Text fontSize='lg' color={colorMode === 'light' ? 'black' : 'white'}>
        {blogPost.content}
      </Text>
      <Flex justifyContent='space-between' alignItems='center' mt={6}>
        <Text fontSize='sm' color='gray.500'>
          Posted by {blogPost.shelter_name}
        </Text>
        <Flex alignItems='center'>
          <Badge
            colorScheme='blue'
            fontSize='xl'
            mr={2}
            borderRadius='md'
            px={2}
            py={1}
          >
            Likes: {blogPost.likes}
          </Badge>
          {String(localStorage.getItem('user_name')) != String(blogPost.shelter_name) &&
            <IconButton
              aria-label='Like'
              icon={<AiFillHeart />}
              size='md'
              colorScheme={isLiked ? 'red' : 'gray'} // Dynamically set colorScheme
              variant='outline'
              onClick={handleLike}
            />}
        </Flex>
      </Flex>
    </Box>
  );
};

export default BlogPost;
