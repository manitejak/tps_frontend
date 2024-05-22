import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TenderForm.css';
import API_BASE_URL from '../config';
import Plot from 'react-plotly.js';
import { Container, TextField, MenuItem, Button, Grid, Box, Typography,Popover, colors,Alert } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Label, ResponsiveContainer,
    LabelList,LineChart, Line, Legend, } from 'recharts';
import { AlignHorizontalLeft } from '@mui/icons-material';


const TenderForm = () => {
    const [formData, setFormData] = useState({
        tender_name: '',
        quantity: '',
        price: '',
        account: '',
        state: '',
        city: '',
        brand: '',
        contract_duration: '',
        month: '',
        distributor: '',
        price_b: '', // Added to formData to handle Scenario B
    });

    const [options, setOptions] = useState({
        accounts: [],
        states: [],
        cities: [],
        brands: [],
        contractDurations: [],
        months: [],
        distributors: [],
    });

    const [sectionBData, setSectionBData] = useState(false);
    const [sectionCData, setSectionCData] = useState(false);
    const [sectionDData, setSectionDData] = useState(false);
    const [showGraphC, setShowGraphC] = useState(false);
    const [showGraphD, setShowGraphD] = useState(false);
    const [showGraphB, setShowGraphB] = useState(false);
    const [winProbability, setWinProbability] = useState(false);
    const [winProbabilityb, setWinProbabilityb] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch options for dropdowns from backend
        const fetchOptions = async () => {
            try {
                const [accounts, states, cities, brands, contractDurations, months, distributors] = await Promise.all([
                    axios.get(`${API_BASE_URL}accounts/`),
                    axios.get(`${API_BASE_URL}states/`),
                    axios.get(`${API_BASE_URL}cities/`),
                    axios.get(`${API_BASE_URL}brands/`),
                    axios.get(`${API_BASE_URL}contract_durations/`),
                    axios.get(`${API_BASE_URL}months/`),
                    axios.get(`${API_BASE_URL}distributors/`)
                ]);

                console.log('Fetched Accounts:', accounts.data);
                console.log('Fetched States:', states.data);
                console.log('Fetched Cities:', cities.data);
                console.log('Fetched Brands:', brands.data);
                console.log('Fetched Contract Durations:', contractDurations.data);
                console.log('Fetched Months:', months.data);
                console.log('Fetched Distributors:', distributors.data);

                setOptions({
                    accounts: accounts.data,
                    states: states.data,
                    cities: cities.data,
                    brands: brands.data,
                    contractDurations: contractDurations.data,
                    months: months.data,
                    distributors: distributors.data,
                });
            } catch (error) {
                console.error('Error fetching dropdown options', error);
                setError('Failed to fetch options. Please try again later.');
            }
        };
        fetchOptions();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}tenders/`, formData);
            console.log('Form submitted successfully:', response.data);
            const { sectionCData,winProbability,sectionDData } = response.data;
            setSectionCData(sectionCData);
            setWinProbability(winProbability);
            setSectionDData(sectionDData);
            setShowGraphD(true);
            setShowGraphC(true);
            setError(null);
        } catch (error) {
            console.error('Error submitting form:', error); // Log the full error object
            setError(error.response ? error.response.data.message : 'An error occurred while submitting the form.');
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}btenders/`, formData);
            console.log('Form submitted successfully:', response.data);
            const { sectionBData,winProbabilityb,sectionDData } = response.data;
            setSectionBData(sectionBData);
            setWinProbabilityb(winProbabilityb);
            setSectionDData(sectionDData);
            setShowGraphD(true);
            setShowGraphB(true);
            setError(null);
        } catch (error) {
            console.error('Error submitting form:', error); // Log the full error object
            setError(error.response ? error.response.data.message : 'An error occurred while submitting the form.');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <Box sx={{ height: '100vh', width: '100vw', padding: '20px', boxSizing: 'border-box' }}>
            <Grid container spacing={3} sx={{ height: '100%', width: '100%' }}>
            {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
                {/* Quadrant 1 */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', border: '1px solid #ddd', padding: '20px', overflowY: 'auto' }}>
                    <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" component="div" sx={{ marginBottom: '20px', background: '#007bff', color: '#fff', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
                            Scenario A - (Baseline)
                        </Typography>
                        <Box mb={2}>
                            <TextField
                                fullWidth
                                label="Tender Name"
                                name="tender_name"
                                value={formData.tender_name}
                                onChange={handleChange}
                                placeholder="Enter Name"
                                variant="outlined"
                            />
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Quantity"
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    placeholder="Enter Value"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Price"
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="Enter Value"
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                        <Box mt={2} mb={2} sx={{ borderTop: '1px solid #ccc' }}></Box>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Account List"
                                    name="account"
                                    value={formData.account}
                                    onChange={handleChange}
                                    variant="outlined"
                                >
                                    <MenuItem value=""><em>Select Account</em></MenuItem>
                                    {options.accounts.map((account) => (
                                        <MenuItem key={account.id} value={account.id}>{account.name}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="State"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    variant="outlined"
                                >
                                    <MenuItem value=""><em>Select State</em></MenuItem>
                                    {options.states.map((state) => (
                                        <MenuItem key={state.id} value={state.id}>{state.name}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="City"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    variant="outlined"
                                >
                                    <MenuItem value=""><em>Select City</em></MenuItem>
                                    {options.cities.map((city) => (
                                        <MenuItem key={city.id} value={city.id}>{city.name}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Brand"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    variant="outlined"
                                >
                                    <MenuItem value=""><em>Select Brand</em></MenuItem>
                                    {options.brands.map((brand) => (
                                        <MenuItem key={brand.id} value={brand.id}>{brand.name}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Contract Duration"
                                    name="contract_duration"
                                    value={formData.contract_duration}
                                    onChange={handleChange}
                                    variant="outlined"
                                >
                                    <MenuItem value=""><em>Select Duration</em></MenuItem>
                                    {options.contractDurations.map((duration) => (
                                        <MenuItem key={duration.id} value={duration.id}>{duration.duration}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Month"
                                    name="month"
                                    value={formData.month}
                                    onChange={handleChange}
                                    variant="outlined"
                                >
                                    <MenuItem value=""><em>Select Month</em></MenuItem>
                                    {options.months.map((month) => (
                                        <MenuItem key={month.id} value={month.id}>{month.name}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Distributor"
                                    name="distributor"
                                    value={formData.distributor}
                                    onChange={handleChange}
                                    variant="outlined"
                                >
                                    <MenuItem value=""><em>Select Distributor</em></MenuItem>
                                    {options.distributors.map((distributor) => (
                                        <MenuItem key={distributor.id} value={distributor.id}>{distributor.name}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                        <Box mt={2} sx={{ marginTop: 'auto' }}>
                            <Button type="submit" variant="contained" color="primary" sx={{ float: 'right' }}>Generate</Button>
                        </Box>
                    </form>
                </Grid>
                {/* Quadrant 2 */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', border: '1px solid #ddd', padding: '20px', overflowY: 'auto' }}>
                    <Typography variant="h6" component="div" sx={{ textAlign: 'center', marginBottom: '20px' }}>Scenario B</Typography>
                    <form onSubmit={handleGenerate} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <TextField
                            fullWidth
                            label="Price"
                            type="number"
                            name="price_b"
                            value={formData.price_b}
                            onChange={handleChange}
                            placeholder="Enter Value"
                            variant="outlined"
                            sx={{ marginRight: 20 }}
                        />
                        <Box sx={{ marginLeft: 2 }}>
                            <Button type="submit" variant="contained" color="primary">Generate</Button>
                        </Box>
                    </form>
                    {showGraphB && sectionBData && (
                    <Box position="relative">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={[
                                { name: 'Revenue', value: sectionBData.revenue},
                                { name: 'Margin', value: sectionBData.margin }
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 170000]} ticks={[0, 30000, 50000, 70000, 90000, 110000, 130000, 150000, 170000]}>
                                    <Label value="Unit Price" angle={-90} position="insideLeft" offset={-3}/>
                                </YAxis>
                                <Tooltip />
                                <Bar dataKey="value" fill="#8884d8">
                                    <LabelList dataKey="value" position="top" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <Box position="absolute" top={0} right={0} p={2} bgcolor="transparent" boxShadow={2} color={"violet"}>
                            <Typography>Win Probability: {winProbabilityb}%</Typography>
                        </Box>
                    </Box>
                    )}
                </Grid>
                {/* Quadrant 3 */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', border: '1px solid #ddd', padding: '20px', overflowY: 'auto' }}>
                    {showGraphC&& sectionCData && (
                    <Box position="relative">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={[
                            { name: 'Revenue', value: sectionCData.revenue},
                            { name: 'Margin', value: sectionCData.margin }
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 170000]} ticks={[0, 30000, 50000, 70000, 90000, 110000, 130000, 150000, 170000]}>
                                <Label value="Unit Price" angle={-90} position="insideLeft" offset={-3}/>
                            </YAxis>
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8">
                                <LabelList dataKey="value" position="top" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <Box position="absolute" top={0} right={0} p={2} bgcolor="transparent" boxShadow={2} color={"violet"}>
                        <Typography>Win Probability: {winProbability}%</Typography>
                    </Box>
                </Box>
                    )}
                </Grid>
                {/* Quadrant 4 */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', border: '1px solid #ddd', padding: '20px', overflowY: 'auto' }}>
                    {/* <Typography variant="h6" component="div" sx={{ textAlign: 'center', marginBottom: '20px' }}>Scenario Log and Graph</Typography> */}
                    {showGraphD && sectionDData && ( 
                    <Box style={{ position: 'relative', width: '100%', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={Array.isArray(sectionDData) ? sectionDData : [sectionDData]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="price"
                                    type="number"
                                    domain={[80, 280]}
                                    tickCount={20}
                                    reversed
                                />
                                <YAxis yAxisId="left" label={{ value: 'Win Probability (%)', angle: -90, position: 'insideLeft', offset: 15 }} domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                                <YAxis yAxisId="right" orientation="right" label={{ value: 'Margin Price', angle: 90, position: 'insideRight', offset: 15 }} domain={[5000, 100000]} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="winProbability" stroke="#8884d8" yAxisId="left" dot={{ stroke: '#8884d8', strokeWidth: 2 }}>
                                    <LabelList dataKey="winProbability" position="top" formatter={(value) => `${value}%`} />
                                </Line>
                                <Line type="monotone" dataKey="margin" stroke="#82ca9d" yAxisId="right" dot={{ stroke: '#82ca9d', strokeWidth: 2 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>       
                    )}
                </Grid>
        </Grid> 
    </Box>
);
};

export default TenderForm;