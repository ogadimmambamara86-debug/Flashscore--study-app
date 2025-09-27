
import mongoose, { Document, Schema } from 'mongoose';

export interface INewsAuthor {
  id: string;
  name: string;
  icon: string;
  bio?: string;
  expertise: string[];
  collaborationCount: number;
}

export interface INews extends Document {
  id: number;
  title: string;
  preview: string;
  fullContent: string;
  author: INewsAuthor;
  collaborationType?: 'prediction' | 'analysis' | 'community' | 'update';
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
    type: Schema.Types.Mixed,
    required: true,
    default: 'Admin',
    // Support both string (legacy) and object (new) formats
    validate: {
      validator: function(value: any) {
        return typeof value === 'string' || 
               (typeof value === 'object' && value.name && value.icon);
      },
      message: 'Author must be either a string or an object with name and icon'
    }
  },
  collaborationType: {
    type: String,
    enum: ['prediction', 'analysis', 'community', 'update'],
    default: 'update'
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
