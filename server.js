const express = require('express');
const app = express();
const port = 3000;

const mongoose = require('mongoose');
const Budget =  require('./mongo_models/schema')
let url = 'mongodb://127.0.0.1:27017/testdb';

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(
    () => (
        console.log("Connected")
    )
).catch(
    (connectionError) => console.log("Error while connecting to db", connectionError)
    );

app.use('/', express.static('public'));

app.use(express.json());       
app.use(express.urlencoded());
app.post('/addBudgetItem',async (req, res) => {
    try {
        const { title, budget, color } = req.body;

        const newBudgetItem = new Budget({
            title,
            budget,
            color,
        });

        // Save the new item to the database using async/await
        const savedItem = await newBudgetItem.save();
        console.log('Budget item saved:', savedItem);
        res.status(201).json({ "success": "true", "data": savedItem });
    } catch (err) {
        console.error('Error saving budget item:', err);
        res.status(500).json({ error: 'Error saving budget item' });
    }
});

app.get('/budget',async (req,res) => {
    try {
        // Fetch all budget items using async/await
        const budgetItems = await Budget.find();
        res.status(200).json({ "success": "true", "data": budgetItems });
    } catch (err) {
        console.error('Error fetching budget items:', err);
        res.status(500).json({ error: 'Error fetching budget items' });
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port} `);
});
