// src/App.js
import React, { useState } from 'react';
import TenderForm from './components/TenderForm';
import TenderResults from './components/TenderResults';
import './App.css';
import axios from 'axios';

const App = () => {
    const [tenderId, setTenderId] = useState(null);

    const handleFormSubmit = async (formData) => {
        try {
            const response = await axios.post('/api/tenders/', formData);
            setTenderId(response.data.id);
        } catch (error) {
            console.error('There was an error creating the tender!', error);
        }
    };

    return (
        <div className="app">
            <div className="section-a">
                <TenderForm onSubmit={handleFormSubmit} />
            </div>
            <div className="section-b-c">
                {tenderId && <TenderResults tenderId={tenderId} />}
            </div>
        </div>
    );
};

export default App;
