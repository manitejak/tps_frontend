// src/components/TenderResults.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Plotly from 'plotly.js-dist';

const TenderResults = ({ tenderId }) => {
    const [tenderData, setTenderData] = useState(null);

    useEffect(() => {
        const fetchTenderData = async () => {
            try {
                const result = await axios.get(`/api/tenders/${tenderId}`);
                setTenderData(result.data);
            } catch (error) {
                console.error('Error fetching tender data', error);
            }
        };

        fetchTenderData();
    }, [tenderId]);

    useEffect(() => {
        if (tenderData) {
            // Generate Plotly graphs
            const data = [
                {
                    x: tenderData.x_values, // Update based on actual data structure
                    y: tenderData.y_values, // Update based on actual data structure
                    type: 'scatter'
                }
            ];

            Plotly.newPlot('graphB', data);
            Plotly.newPlot('graphC', data);
        }
    }, [tenderData]);

    return (
        <div>
            <div id="graphB" style={{ width: '100%', height: '50%' }}></div>
            <div id="graphC" style={{ width: '100%', height: '50%' }}></div>
        </div>
    );
};

export default TenderResults;
