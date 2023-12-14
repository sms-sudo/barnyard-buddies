// Rating.js
import { StarIcon } from '@chakra-ui/icons';
import { Box, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const Rating = ({ rating }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const isFilled = i < rating;
      stars.push(
        <StarIcon
          key={i}
          color={isFilled ? 'teal.500' : 'gray.300'}
          boxSize={5}
        />
      );
    }
    return stars;
  };

  return (
    <Box>
      {renderStars()}
      <Text ml={2} display='inline'>
        {rating} Stars
      </Text>
    </Box>
  );
};

// Add prop types
Rating.propTypes = {
  rating: PropTypes.number.isRequired, // Require rating as a number
};

export default Rating;
