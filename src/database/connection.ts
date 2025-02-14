import mongoose from "mongoose";
const dbString =
  "mongodb+srv://jack:jack1234@cluster0.64lss.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const connectString = async () => {
  await mongoose.connect(dbString);
  console.log("connected to db");
};
export default connectString;
