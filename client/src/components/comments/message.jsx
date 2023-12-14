import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text } from '@chakra-ui/react';

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

const Message = ({ text, sender, name, timestamp, shelterName }) => {
  const isShelter = sender;
  const formattedTimestamp = formatDate(timestamp);

  return (
    <Box
      bg={isShelter ? 'blue.500' : 'gray.300'}
      color={isShelter ? 'white' : 'black'}
      p={4}
      borderRadius='md'
      maxW='70%'
      alignSelf={isShelter ? 'flex-start' : 'flex-end'}
      mb={4}
      position='relative'
    >
      <Text fontSize='lg'>{text}</Text>
      <Box
        mt={2}
        display='flex'
        justifyContent='space-between'
        alignItems='center'
      >
        {
          <Text fontWeight='bold' color='black' pr='3rem' fontSize='xs'>
            {shelterName}
          </Text>
        }
        {name && (
          <Text fontWeight='bold' color='black' pr='3rem' fontSize='xs'>
            {name}
          </Text>
        )}
        <Text fontSize='xs' color={isShelter ? 'white' : 'gray.500'}>
          {formattedTimestamp}
        </Text>
      </Box>
    </Box>
  );
};

Message.propTypes = {
  text: PropTypes.string.isRequired,
  sender: PropTypes.oneOf([true, false]).isRequired,
  name: PropTypes.string,
  timestamp: PropTypes.string,
  shelterName: PropTypes.string,
};

export default Message;
