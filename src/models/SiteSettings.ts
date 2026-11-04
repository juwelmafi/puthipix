import mongoose, { Schema, Document } from "mongoose";
import { SiteContent, DEFAULT_SITE_CONTENT } from "@/data/defaultSiteContent";

export interface ISiteSettings extends Document {
  key: string;
  content: SiteContent;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "global_site_settings",
      index: true,
    },
    content: {
      type: Schema.Types.Mixed,
      required: true,
      default: DEFAULT_SITE_CONTENT,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

