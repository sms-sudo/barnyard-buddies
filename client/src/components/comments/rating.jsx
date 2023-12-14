import React from 'react';
import PropTypes from 'prop-types';
import { StarIcon } from '@chakra-ui/icons';
import { Box, Text, Flex } from '@chakra-ui/react';

const RatingModal = ({ rating, onRatingChange, maxStars }) => {
  const handleStarClick = (selectedRating) => {
    // If the clicked star is the same as the current rating, unselect it
    const newRating = selectedRating === rating ? 0 : selectedRating;
    onRatingChange(newRating);
  };

  return (
    <Flex justify='space-between' alignItems='center'>
      <Box display='flex' alignItems='center'>
        {[...Array(maxStars)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= rating;

          return (
            <Box key={index} ml={2} display='flex' alignItems='center'>
              <StarIcon
                boxSize={5}
                color={isFilled ? 'teal.500' : 'gray.300'}
                onClick={() => handleStarClick(starValue)}
                _hover={{ cursor: 'pointer' }}
              />
            </Box>
          );
        })}
      </Box>
      <Text ml={2} fontWeight='bold' fontSize='lg'>
        Total Stars: {rating}
      </Text>
    </Flex>
  );
};

RatingModal.propTypes = {
  rating: PropTypes.number,
  onRatingChange: PropTypes.func.isRequired,
  maxStars: PropTypes.number.isRequired,
};

export default RatingModal;
