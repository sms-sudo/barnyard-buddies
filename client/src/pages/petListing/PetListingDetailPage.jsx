import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import defaultImage from "../../assests/default.png"
import { Card, Grid, Image, CardBody, Text, GridItem, Divider, Stack, Button, Center} from '@chakra-ui/react';
import { EmailIcon } from "@chakra-ui/icons";
import { useMediaQuery } from 'react-responsive'
import TimeAgo from 'react-timeago'


function PetListingDetailPage() {
    const navigate = useNavigate();
    const isLargeScreen = useMediaQuery({ query: '(min-width: 1920px)' });
    const isSmallScreen = useMediaQuery({ query: '(max-width: 844px)' });
    let columns;
    if (isLargeScreen) {
        columns = 'repeat(2, 1fr)';
    } else if (isSmallScreen) {
        columns = 'repeat(1, 2fr)';
    }

    const cardstyle = {
        borderColor: "#d9edad",
        borderWidth: "15px",
        

    };
    const gridstyle = {
        display: 'grid',
        gridTemplateRows: 'repeat(1, 1fr)',
        gridTemplateColumns: columns,
        gap: "6px",
        justifyContent: "center",
        padding: "15px",
        borderRadius: "10px"

    };
    const [pet, setPet] = useState(null);
    const { petId } = useParams();


    const fetchpetdetail = async () => {
        let queryString = `http://127.0.0.1:8000/petListing/${petId}/`;
        try {
            const response = await axios.get(queryString);
            setPet(response.data);
        } catch (error) {
            console.error('Error fetching Pet Listing:', error);
        }
    };

    useEffect(() => {
        fetchpetdetail();
    }, [petId]);

    if (!pet) {
        return <div>Loading...</div>;
    }
    const imageUrl = `http://127.0.0.1:8000/${pet.avatar}` || defaultImage;
    let color;
    if (pet.status === 'pending'){
        color = '#ffc36d'; //yellow
    } else if 
    (pet.status === 'available'){
        color = '#7ae036'; //green
    } else 
    {color = 'red';}

    console.log(pet)
    const handleApplicationClick = (petId) => {
        navigate(`/start-application/${petId}`);
    };
    return(
        <>
            <Grid style={gridstyle}>
                <GridItem>
                    <Card variant={'outline'} style={cardstyle}>
                        <CardBody style={{display: "flex", justify: "center", flexDirection: "column"}}>
                            <h1 style={{textAlign:'center', fontSize:"40px"}}>Name: {pet.name}</h1>
                            <Divider />
                            <Image style={{alignSelf:'center'}}
                                src={imageUrl}
                                alt={pet.name || 'Pet'}
                                borderRadius='lg'
                            />
                            
                            <Text fontSize = "25px" style={{margin: "10px",textAlign:'center'}}>Gender: {pet.gender} | Breed: {pet.breed} | Size: {pet.size}</Text>
                            <Text fontSize = "25px" style={{margin: "10px",textAlign:'center'}}>Age: {pet.age} | Color: {pet.color} </Text>
                            <Text fontSize = "25px" style={{margin: "10px",textAlign:'center'}}>Characteristics: {pet.characteristics}</Text>
                            <div style={{margin: "10px", alignSelf:'center'}}>
                                Posted <TimeAgo fontSize = "15px" style={{textAlign:'center'}} date={pet.date_posted}/>
                            </div>
                            

                            
                        </CardBody>
                    </Card>
                </GridItem>

                <GridItem>
                    <Card style={cardstyle}>
                        <CardBody style={{display: "flex", justify: "center", flexDirection: "column"}}>
                            <Text fontSize = "25px" style={{margin: "10px",textAlign:'center'}}>Pet Description: {pet.description}</Text>
                            <Card style={{alignSelf:"center", backgroundColor: color, borderRadius: '50px', maxWidth: "45%",minWidth: "500px" }}>
                                <Text style={{textAlign:'center', fontSize:"30px", margin: "15px"}}>Adoption Status: {pet.status}</Text>
                            </Card>
                            <Stack direction='row' spacing={4} margin={15} justify="center">
                                <Button leftIcon={<EmailIcon />} colorScheme='teal' variant='solid'>
                                    Email
                                </Button>
                                {localStorage.getItem('is_pet_shelter_user') != 'true' && 
                                <Button colorScheme='teal' variant='outline' onClick={() => handleApplicationClick(petId)}>
                                    Adopt !
                                </Button>} 
                                
                            </Stack>
                           
                        </CardBody>
                    </Card>
                </GridItem>
                </Grid>
                
            
        </>

    )

}

export default PetListingDetailPage