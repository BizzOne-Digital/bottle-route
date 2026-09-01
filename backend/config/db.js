const mongoose = require('mongoose');

// Cached across invocations so serverless cold starts (Vercel) reuse
// the same connection instead of opening a new one per request.
let cached = global._mongooseConn;
if (!cached) cached = global._mongooseConn = { conn: null, promise: null };

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      // Serverless-friendly: keep each function instance's pool tiny so many
      // concurrent cold starts against a shared/low-tier cluster don't exhaust
      // its connection limit. serverSelectionTimeoutMS is generous (not
      // aggressively short) because a truly cold Vercel invocation doing DNS
      // SRV lookup + TLS + auth against Atlas can genuinely take several
      // seconds — cutting this too short causes false failures on the first
      // request after idle, not just on real outages.
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 20000,
    }).then((m) => {
      console.log(`MongoDB Connected: ${m.connection.host}`);
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error(`DB Connection Error: ${error.message}`);
    throw error;
  }

  return cached.conn;
};

module.exports = connectDB;
