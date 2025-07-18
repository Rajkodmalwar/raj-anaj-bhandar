const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = "RAB";

router.use(express.json());

router.post('/feedback', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    await db.collection("feedback").insertOne(req.body);
    res.status(200).json({ message: "Feedback submitted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});

router.get('/feedbacks', async (req, res) => {
  try {
    await client.connect();
    const feedbacks = await client.db(dbName).collection("feedback").find().toArray();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

router.get('/feedbacks/csv', async (req, res) => {
  try {
    await client.connect();
    const feedbacks = await client.db(dbName).collection("feedback").find().toArray();
    const header = "Name,RiceType,Quality,Taste,Price,Comment\n";
    const csv = feedbacks.map(f =>
      `${f.name},${f.riceType},${f.rating.quality},${f.rating.taste},${f.rating.price},"${f.comment}"`).join("\n");
    res.setHeader('Content-Type', 'text/csv');
    res.attachment('feedbacks.csv');
    res.send(header + csv);
  } catch (err) {
    res.status(500).json({ error: "CSV Export failed" });
  }
});

module.exports = router;
