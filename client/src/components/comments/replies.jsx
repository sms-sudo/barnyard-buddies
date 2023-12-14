import React, { useState } from 'react';
import { Box, Collapse, Text, Button, Flex, Spacer } from '@chakra-ui/react';
import RatingModal from './stars';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

const Replies = ({ comment, onReplyClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { petShelterID } = useParams(); // Fetch shelterID from route parameters

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  function formatReadableDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
    });
  }

  const isPetSeeker = comment.comment_made_by_the_id_pet_shelter === null;
  const isCommentByShelter =
    comment.comment_made_by_the_id_pet_shelter === parseInt(petShelterID, 10);
  console.log('isCommentByShelter', isCommentByShelter);
  return (
    <Box
      key={comment.id}
      p={5}
      borderWidth='1px'
      borderRadius='md'
      bg={isCommentByShelter ? 'green.100' : '#F3F3F3'}
      borderColor={isCommentByShelter ? 'green.500' : '#666'}
    >
      <Flex alignItems='center'>
        <Box>
          <Text fontSize='lg' fontWeight='bold'>
            {comment.name}
            {isCommentByShelter && (
              <span role='img' aria-label='star' style={{ marginLeft: '4px' }}>
                ⭐
              </span>
            )}
          </Text>
          {!comment.is_reply && <RatingModal rating={comment.rating} />}
          <Text fontSize='sm' color='gray.500' mt={2}>
            {isPetSeeker ? 'Pet Seeker' : 'Pet Shelter'}
          </Text>
        </Box>
        <Spacer />
        {comment.replies && comment.replies.length > 0 && (
          <Button onClick={toggleCollapse} colorScheme='blue'>
            {isOpen ? 'Hide Replies' : 'Show Replies'}
          </Button>
        )}
        <Button
          onClick={() => onReplyClick(comment.id)}
          colorScheme='blue'
          ml={2}
        >
          Reply
        </Button>
      </Flex>

      <Box>
        {/* Render content specific to replies under the toggle */}
        <Text mt={3}>{comment.comment_text}</Text>
        <Text fontSize='sm' color='gray.500' mt={4}>
          Created at: {formatReadableDate(comment.comment_creation_time)}
        </Text>
      </Box>

      <Collapse in={isOpen} animateOpacity>
        <Box mt={4}>
          {comment.replies && comment.replies.length > 0 ? (
            comment.replies.map((reply) => (
              <Replies
                key={reply.id}
                comment={reply}
                onReplyClick={onReplyClick}
              />
            ))
          ) : (
            <Text>No replies available.</Text>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

Replies.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    rating: PropTypes.number,
    comment_text: PropTypes.string.isRequired,
    comment_creation_time: PropTypes.string.isRequired,
    replies: PropTypes.arrayOf(PropTypes.object),
    is_reply: PropTypes.bool.isRequired,
    parent_comment: PropTypes.number,
    comment_made_by_the_id_pet_shelter: PropTypes.number, // Adjust the type based on your actual data structure
  }).isRequired,
  onReplyClick: PropTypes.func.isRequired,
};

export default Replies;
