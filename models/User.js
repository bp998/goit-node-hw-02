import mongoose from "mongoose";
import { contactSchema } from "#validators/users/MongooseSchema.js";

export const Contact = mongoose.model("contact", contactSchema, "contacts");
