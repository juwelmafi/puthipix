import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBook extends Document {
  title: string;
  titleEn?: string;
  slug: string;
  author: string;
  translator?: string;
  description: string;
  synopsis?: string[];
  coverKey?: string;
  coverImage: string;
  pdfKey?: string;
  price: number;
  accessType: "free" | "premium";
  published: boolean;
  featured: boolean;
  recentlyAdded: boolean;
  publishedYear: number;
  edition?: string;
  pageCount: number;
  language: string;
  genre: string;
  genreSlug: string;
  category: string;
  categorySlug: string;
  genreIds: mongoose.Types.ObjectId[];
  categoryIds: mongoose.Types.ObjectId[];
  publisher?: string;
  tableOfContents?: string[];
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
      index: true,
    },
    titleEn: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Book slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
      index: true,
    },
    translator: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    synopsis: {
      type: [String],
      default: [],
    },
    coverKey: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      required: [true, "Cover image is required"],
    },
    pdfKey: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      default: 0,
      min: 0,
    },
    accessType: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
      index: true,
    },
    published: {
      type: Boolean,
      default: true,
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    recentlyAdded: {
      type: Boolean,
      default: true,
    },
    publishedYear: {
      type: Number,
      default: 2026,
    },
    edition: {
      type: String,
      default: "প্রথম প্রকাশ",
    },
    pageCount: {
      type: Number,
      default: 100,
    },
    language: {
      type: String,
      default: "বাংলা",
    },
    genre: {
      type: String,
      default: "সাধারণ",
    },
    genreSlug: {
      type: String,
      default: "general",
      index: true,
    },
    category: {
      type: String,
      default: "সাধারণ সংকলন",
    },
    categorySlug: {
      type: String,
      default: "general",
      index: true,
    },
    genreIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Genre",
      },
    ],
    categoryIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    publisher: {
      type: String,
      default: "পুঁথিপিক্স প্রেস",
    },
    tableOfContents: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 5.0,
    },
  },
  {
    timestamps: true,
  }
);

// Text Index for Fast Multilingual Search
BookSchema.index({
  title: "text",
  titleEn: "text",
  author: "text",
  description: "text",
});

export const Book: Model<IBook> =
  mongoose.models.Book || mongoose.model<IBook>("Book", BookSchema);

export default Book;

