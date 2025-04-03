require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const CUSTOM_OBJECT_NAME = "practicums"; 
// Route 1: Homepage - Fetch and display custom object data
app.get('/', async (req, res) => {
    const customObjectUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_NAME}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    
    try {
        const response = await axios.get(`${customObjectUrl}?properties=name,description,type`, { headers });
        const data = response.data.results;
        console.log(data)
        res.render('homepage', { title: 'Custom Objects | HubSpot APIs', data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching custom object data');
    }
});

// Route 2: Render form for creating/updating custom objects
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// Route 3: Handle form submission to create a new custom object record
app.post('/update-cobj', async (req, res) => {
    const customObjectUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_NAME}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    const newObjectData = {
        properties: {
            "name": req.body.name, 
            "description": req.body.description,
            "type": req.body.type
        }
    };

    try {
        await axios.post(customObjectUrl, newObjectData, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating/updating custom object: ' + JSON.stringify(error));
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
