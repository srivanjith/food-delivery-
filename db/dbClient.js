import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

console.log("Debug - process.env.MONGODB_URI:", process.env.MONGODB_URI ? "Found" : "Not Found");
if (process.env.MONGODB_URI) {
  console.log("Debug - MONGODB_URI value:", process.env.MONGODB_URI.replace(/:[^:/@]+@/, ":****@"));
}

// Use MONGODB_URI from environment as primary connection string, or fall back to user's snippet URI
const dbPassword = process.env.DB_PASSWORD || 'vishnu2007';
let connectionString = process.env.MONGODB_URI || `mongodb+srv://vishnurajendranv76_db_user:${dbPassword}@cluster0.sin728q.mongodb.net/?appName=Cluster0`;

// Safely substitute the password if the placeholder is still present in the connection string
if (connectionString.includes('<db_password>')) {
  connectionString = connectionString.replace('<db_password>', 'vishnu2007');
}

console.log("Debug - resolved connectionString:", connectionString.replace(/:[^:/@]+@/, ":****@"));

const client = new MongoClient(connectionString);
let activeClient = null;

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    activeClient = client;
    return activeClient;
  } catch (err) {
    const isSrvError = err.message && (err.message.includes('querySrv') || err.message.includes('ECONNREFUSED'));
    if (isSrvError) {
      console.warn("Direct connection via SRV failed. Attempting fallback to Replica Set connection string...");
      const replicaSetUri = "mongodb://vishnurajendranv76_db_user:vishnu2007@ac-tqf93tz-shard-00-00.sin728q.mongodb.net:27017,ac-tqf93tz-shard-00-01.sin728q.mongodb.net:27017,ac-tqf93tz-shard-00-02.sin728q.mongodb.net:27017/ecoeats?ssl=true&replicaSet=atlas-mrk57q-shard-0&authSource=admin&retryWrites=true&w=majority";
      try {
        activeClient = new MongoClient(replicaSetUri);
        await activeClient.connect();
        console.log("You successfully connected to MongoDB (via Replica Set fallback)!");
        return activeClient;
      } catch (fallbackErr) {
        console.error("Fallback connection also failed:", fallbackErr.message);
        throw fallbackErr;
      }
    }
    console.error("Error connecting to MongoDB direct client:", err);
    throw err;
  }
}

// Call this only when your application terminates
export async function disconnectFromMongoDB() {
  try {
    if (activeClient) {
      await activeClient.close();
      console.log("Disconnected from MongoDB direct client.");
      activeClient = null;
    }
  } catch (err) {
    console.error("Error disconnecting from MongoDB direct client:", err);
  }
}

// If run directly: e.g., "node dbClient.js"
const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);

if (isDirectRun) {
  console.log("Running self-check database connection...");
  connectToMongoDB()
    .then(async (actCl) => {
      if (actCl) {
        // Ping database to confirm connection is functional
        const db = actCl.db('ecoeats');
        const pingResult = await db.command({ ping: 1 });
        console.log("Database ping successful:", pingResult);
        await disconnectFromMongoDB();
      }
    })
    .catch((err) => {
      console.error("Database connection self-check failed:", err.message);
      process.exit(1);
    });
}


