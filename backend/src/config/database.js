import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://nikhilkumawat24120:pZGrKonrbfIEdOLy@collageeventmanagement.2z8r3.mongodb.net/?retryWrites=true&w=majority&appName=collageEventManagement");

    console.log("Connection established");
  } catch (err) {
    throw new Error("Couldn't connect'");
    process.exit(1);
  }
};
export default connectDb;
