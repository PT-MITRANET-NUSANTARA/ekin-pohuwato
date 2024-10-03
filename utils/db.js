import mongoose from 'mongoose';

const uri = process.env.NEXT_PUBLIC_MONGODB_URI;
console.log(uri);


const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

let cached = globalThis.mongooseCached || (globalThis.mongooseCached = { conn: null, promise: null });

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    
    cached.promise = mongoose.connect(uri, clientOptions).then(mongooseInstance => {
      return mongooseInstance;
    }).catch(err => {
      console.error('Failed to connect to MongoDB:', err);
      throw err;
    });
  }
  
  cached.conn = await cached.promise;
  
  return cached.conn;
}

export default dbConnect;
