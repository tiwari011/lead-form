import mongoose, { Model, Schema } from "mongoose";

export type LeadDocument = {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  company: string;
  requirement: string;
  submissionTime: Date;
  emailSent: boolean;
  emailOpened: boolean;
  emailOpenedAt: Date | null;
  linkClicked: boolean;
  linkClickedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const LeadSchema = new Schema<LeadDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      default: "",
      trim: true
    },
    requirement: {
      type: String,
      required: true,
      trim: true
    },
    submissionTime: {
      type: Date,
      default: Date.now
    },
    emailSent: {
      type: Boolean,
      default: false
    },
    emailOpened: {
      type: Boolean,
      default: false
    },
    emailOpenedAt: {
      type: Date,
      default: null
    },
    linkClicked: {
      type: Boolean,
      default: false
    },
    linkClickedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Lead =
  (mongoose.models.Lead as Model<LeadDocument> | undefined) ||
  mongoose.model<LeadDocument>("Lead", LeadSchema);

export default Lead;
