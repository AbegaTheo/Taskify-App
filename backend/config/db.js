import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ Connexion à MongoDB Réussie ! : ${conn.connection.host}`.green.bold.italic);
      console.log("****************************************************************************");
  } catch (error) {
    console.error(`❌ Erreur lors de la connexion à MongoDB : ${error.message}`.red.bold);
      console.log("****************************************************************************");
    process.exit(1);
  }
};

export default connectDB;
