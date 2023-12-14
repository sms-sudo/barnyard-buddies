import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Box, Heading } from "@chakra-ui/react";
import ApplicationCard from "../../components/petListings/ApplicationCard";
import { useParams } from 'react-router-dom';

function ApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const { type, user_user } = useParams();
    let queryString
    useEffect(() => {
        const fetchApplications = async () => {
            if (type == "true") {
                console.log(type)
                queryString = `http://127.0.0.1:8000/shelterApplicationsList/${user_user}/`
            } else {
                queryString = `http://127.0.0.1:8000/seekerApplicationsList/${user_user}/`
            }
            
            try {
                const response = await axios.get(queryString, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    },
                });
                setApplications(response.data);
            } catch (error) {
                console.error('Error fetching myapplications:', error);
            }
        };

        fetchApplications();
    }, []);

    return (
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            {applications.map(application => (
                <ApplicationCard key={application.id} application={application} />
            ))}
        </Grid>
    );
}

export default ApplicationsPage;