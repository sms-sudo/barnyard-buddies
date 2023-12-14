import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchPetListings = (filters, sortOptions) => {
    const [petListings, setPetListings] = useState([]);

    const fetchPetListings = async () => {
        let queryString = 'http://127.0.0.1:8000/petListing/?';

        // Append filters to the query string
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                queryString += `${key}=${filters[key]}&`;
            }
        });

        // Append sorting options to the query string
        Object.keys(sortOptions).forEach(key => {
            if (sortOptions[key]) {
                queryString += `ordering=${sortOptions[key] === 'descending' ? '-' : ''}${key}&`;
            }
        });

        try {
            const response = await axios.get(queryString);
            setPetListings(response.data);
        } catch (error) {
            console.error('Error fetching pet listings:', error);
        }
    };

    useEffect(() => {
        fetchPetListings();
    }, [JSON.stringify(filters), JSON.stringify(sortOptions)]);

    return petListings;
};

export default useFetchPetListings;
