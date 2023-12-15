import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../constants.js';

export const FetchShelter = (shelterId) => {
    const [shelter, setShelter] = useState(null);

    useEffect(() => {
        const fetchShelter = async () => {
            try {
                const response = await axios.get(`${API_URL}accounts/petshelter/${shelterId}`);
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