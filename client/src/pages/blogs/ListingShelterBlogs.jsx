import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Link,
  Text,
  Select,
} from '@chakra-ui/react';

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

const ShelterBlogsList = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [sorting, setSorting] = useState('-date_posted');

  const handleSortingChange = (event) => {
    const selectedSorting = event.target.value;
    setSorting(selectedSorting);
  };

  useEffect(() => {
    const getListOfBlogPosts = async () => {
      try {
        const response = await axios.get(
          `API_URLblogs/?ordering=${sorting}`
        );
        if (response.status === 200) {
          setBlogPosts(response.data);
        }
      } catch (error) {
        console.error('ERROR IN RETRIEVING BLOGS: ', error.message);
      }
    };

    getListOfBlogPosts();
  }, [sorting]);

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
          Explore the latest blog posts from our Pet Shelters
        </Text>
      </Box>
      <GridItem style={OptionsStyle}>
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
      </GridItem>
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

export default ShelterBlogsList;
