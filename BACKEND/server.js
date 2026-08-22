const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Temporary in-memory queue state (mock database)
let currentToken = 12;

// API Route: Get current queue status for a clinic
app.get('/api/queue/:clinicId', (req, res) => {
    res.json({
        clinicId: req.params.clinicId,
        currentlyServing: currentToken,
        nextInLine: currentToken + 1,
        estimatedWaitTimePerPatientMins: 5
    });
});

// API Route: Doctor calls next token
app.post('/api/queue/:clinicId/next', (req, res) => {
    currentToken += 1;
    res.json({
        message: 'Token advanced successfully',
        currentlyServing: currentToken
    });
});

// API Route: Mock AI Voice Prescription endpoint
app.post('/api/prescriptions/generate', (req, res) => {
    const { transcript } = req.body;
    // In a real app, you would send this to an LLM like Gemini
    res.json({
        message: 'Prescription generated successfully',
        data: {
            symptoms: ['Fever', 'Cough'],
            medicines: ['Paracetamol 500mg', 'Cough Syrup'],
            originalTranscript: transcript
        }
    });
});

app.listen(PORT, () => {
    console.log(`CareGrid Backend Server running on port ${PORT}`);
});
