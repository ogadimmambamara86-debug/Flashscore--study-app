
import mongoose, { Document, Schema } from 'mongoose';

export interface INews extends Document {
  id: number;
  title: string;
  preview: string;
  fullContent: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  tags: string[];
  imageUrl?: string;
  viewCount: number;
}

const NewsSchema: Schema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  preview: {
    type: String,
    required: true,
    maxlength: 500
  },
  fullContent: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true,
    default: 'Admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: {
    type: [String],
    default: []
  },
  imageUrl: {
    type: String,
    default: null
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create indexes for better performance
NewsSchema.index({ createdAt: -1 });
NewsSchema.index({ isActive: 1 });
NewsSchema.index({ tags: 1 });

export default mongoose.model<INews>('News', NewsSchema);
