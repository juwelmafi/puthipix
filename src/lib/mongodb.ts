import dns from "node:dns";
import mongoose from "mongoose";

// Configure fallback DNS servers for environments with custom DNS restrictions
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch {
  // Ignore in restricted environments
}

// Direct standard connection string without SRV dependency (immune to Windows/ISP DNS blocking)
export const DIRECT_ATLAS_URI =
  "mongodb://puthipix_user:Fe5EdTxyN511Ml7N@ac-96hlkqd-shard-00-00.1nozz7u.mongodb.net:27017,ac-96hlkqd-shard-00-01.1nozz7u.mongodb.net:27017,ac-96hlkqd-shard-00-02.1nozz7u.mongodb.net:27017/puthipix?ssl=true&replicaSet=atlas-sgcr0x-shard-0&authSource=admin&retryWrites=true&w=majority";

/**
 * Normalizes MongoDB connection strings.
 * If a mongodb+srv:// URI for the Atlas cluster is detected, it is immediately converted
 * to the direct replica set format. This prevents the driver from querying DNS SRV records
 * which are blocked/refused on many Windows and ISP networks (querySrv ECONNREFUSED).
 */
export function normalizeMongoUri(rawUri?: string): string {
  if (!rawUri || !rawUri.trim()) return DIRECT_ATLAS_URI;
  const trimmed = rawUri.trim();

  if (trimmed.startsWith("mongodb+srv://") && trimmed.includes("cluster0.1nozz7u.mongodb.net")) {
    try {
      const match = trimmed.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@/);
      if (match) {
        const [, user, pass] = match;
        return `mongodb://${user}:${pass}@ac-96hlkqd-shard-00-00.1nozz7u.mongodb.net:27017,ac-96hlkqd-shard-00-01.1nozz7u.mongodb.net:27017,ac-96hlkqd-shard-00-02.1nozz7u.mongodb.net:27017/puthipix?ssl=true&replicaSet=atlas-sgcr0x-shard-0&authSource=admin&retryWrites=true&w=majority`;
      }
    } catch {
      // Fallback below
    }
    return DIRECT_ATLAS_URI;
  }

  return trimmed;
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  const uri = normalizeMongoUri(process.env.MONGODB_URI);

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const opts = {
    bufferCommands: false,
    serverSelectionTimeoutMS: 8000,
  };

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, opts)
      .catch(async (err) => {
        // If querySrv or DNS resolution fails, fall back to direct replica set URI
        if (
          (err.message && (err.message.includes("querySrv") || err.message.includes("ECONNREFUSED"))) ||
          err.code === "ECONNREFUSED"
        ) {
          console.warn(
            "MongoDB SRV DNS query refused. Switching automatically to direct replica set connection..."
          );
          return mongoose.connect(DIRECT_ATLAS_URI, opts);
        }
        throw err;
      })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    cached.promise = null;
    // Automatic fallback attempt with direct replica set hosts
    try {
      console.warn("Retrying MongoDB connection with direct replica set hosts...");
      cached.conn = await mongoose.connect(DIRECT_ATLAS_URI, opts);
      return cached.conn;
    } catch (finalErr) {
      throw e;
    }
  }

  return cached.conn;
}

export default connectToDatabase;
