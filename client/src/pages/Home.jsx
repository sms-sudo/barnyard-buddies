import React from 'react';
import {
  Container,
  Heading,
  Box,
  extendTheme,
  ChakraProvider,
  Button,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const theme = extendTheme({
  fonts: {
    heading: `monospace, sans-serif`,
  },
});

export const Home = () => {
  return (
    <ChakraProvider theme={theme}>
      <Container maxW='100%' padding={0} margin={0}>
        <Box position='relative' width='100%' height='100vh' overflow='hidden'>

          <Heading
            position='absolute'
            fontSize='8xl'
            top='38%'
            left='50%'
            transform='translate(-50%, -50%)'
            color='blue.500'
            textAlign='center'
          >
            {' '}
            Barnyard Buddies{' '}
          </Heading>
          <Link to='/Login'>
            <Button
              top='63%'
              left='50%'
              colorScheme='blue'
              transform='translate(-50%, -50%)'
              width={250}
              fontFamily='monospace'
              size='lg'
            >
              {' '}
              Start
            </Button>
          </Link>
        </Box>
      </Container>
    </ChakraProvider>
  );
};