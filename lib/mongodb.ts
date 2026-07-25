import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local or .env'
  );
}

/**
 * Interface representing the structure of our cached Mongoose connection.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/**
 * Global declaration to define the cached mongoose property.
 * This prevents TypeScript compiler errors when using global.mongoose.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

/**
 * In development, use a global variable to persist the connection across hot reloads.
 * In production, standard module scoping is sufficient.
 */
let cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

/**
 * Establish a connection to MongoDB or retrieve the cached connection.
 * Avoids multiple connections by caching both the connection instance and the pending promise.
 * 
 * @returns {Promise<typeof mongoose>} Resolves to the Mongoose instance.
 */
async function dbConnect(): Promise<typeof mongoose> {
  // Return the cached connection if it exists
  if (cached.conn) {
    return cached.conn;
  }

  // Create a new connection promise if one is not already in progress
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    // Await the connection promise and cache the resolved connection
    cached.conn = await cached.promise;
  } catch (e) {
    // If connection fails, clear the promise so the next call tries again
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
