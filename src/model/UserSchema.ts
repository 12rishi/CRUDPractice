import mongoose, { Document } from "mongoose";
interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  createdAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    validator: {
      validate: function (value: string) {
        return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          value
        );
      },
      message:
        "Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character.",
    },
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    immutable: true,
  },
});
const User = mongoose.model("User", UserSchema);
export default User;
