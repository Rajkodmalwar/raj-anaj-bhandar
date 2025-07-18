const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = "RAB";

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const data = req.body;
      await client.connect();
      const db = client.db(dbName);
      await db.collection("feedback").insertOne(data);
      res.status(200).json({ message: "Feedback submitted" });
    } catch (err) {
      console.error("Insert Error:", err);
      res.status(500).json({ error: "Failed to submit feedback" });
    }
  }

  else if (req.method === 'GET') {
    const { csv } = req.query;

    try {
      await client.connect();
      const feedbacks = await client.db(dbName).collection("feedback").find().toArray();

      if (csv === 'true') {
        const header = "Name,RiceType,Quality,Taste,Price,Comment\n";
        const rows = feedbacks.map(f =>
          `${f.name},${f.riceType},${f.rating?.quality},${f.rating?.taste},${f.rating?.price},"${f.comment}"`)
          .join("\n");
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=feedbacks.csv");
        return res.status(200).send(header + rows);
      }

      return res.status(200).json(feedbacks);
    } catch (err) {
      console.error("Read Error:", err);
      return res.status(500).json({ error: "Error fetching data" });
    }
  }

  else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
