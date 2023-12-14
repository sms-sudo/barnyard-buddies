import { useState, useEffect } from 'react';
import axios from 'axios';

export const FetchShelter = (shelterId) => {
    const [shelter, setShelter] = useState(null);

    useEffect(() => {
        const fetchShelter = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/accounts/petshelter/${shelterId}`);
                setShelter(response.data.address);
            } catch (error) {
                console.error('Error fetching shelter details:', error);
            }
        };

        if (shelterId) {
            fetchShelter();
        }
    }, [shelterId]);

    return shelter;
};