import React from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
} from '@chakra-ui/react';

const PageNotFound = () => {

    return (
        <Container mb={10} p={4}>
            <Box
                mt={10}
                mb={10}
                bg='#FFFFFF'
                borderWidth='8px'
                borderRadius='lg'
                borderColor='#BEE3F8'
                p={4}
            >
                <Heading textAlign='center' fontSize='9xl' mb={4}>
                    404 <Text color='blue.500' fontSize='3xl'>Page Not Found</Text>
                </Heading>

            </Box>
        </Container>
    );
};

export default PageNotFound;
