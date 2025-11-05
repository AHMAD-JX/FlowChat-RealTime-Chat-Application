import mongoose, { Document, Schema } from 'mongoose';

export interface IStatusView {
  user: mongoose.Types.ObjectId;
  viewedAt: Date;
}

export interface IStatus extends Document {
  user: mongoose.Types.ObjectId;
  content: string;
  type: 'text' | 'image' | 'video';
  mediaUrl?: string;
  backgroundColor?: string; // For text statuses
  textColor?: string; // For text statuses
  font?: string; // For text statuses
  views: IStatusView[];
  createdAt: Date;
  expiresAt: Date;
}

const statusSchema = new Schema<IStatus>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 500,
    },
    type: {
      type: String,
      enum: ['text', 'image', 'video'],
      required: true,
    },
    mediaUrl: {
      type: String,
    },
    backgroundColor: {
      type: String,
      default: '#25d366',
    },
    textColor: {
      type: String,
      default: '#ffffff',
    },
    font: {
      type: String,
      default: 'Inter',
    },
    views: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// TTL Index - MongoDB will automatically delete documents after expiresAt
statusSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for querying user's statuses
statusSchema.index({ user: 1, createdAt: -1 });

// Method to check if status is expired
statusSchema.methods.isExpired = function (): boolean {
  return new Date() > this.expiresAt;
};

// Method to add a view
statusSchema.methods.addView = function (userId: string) {
  // Check if user already viewed
  const alreadyViewed = this.views.some(
    (view) => view.user.toString() === userId
  );

  if (!alreadyViewed) {
    this.views.push({
      user: userId,
      viewedAt: new Date(),
    });
  }
};

const Status = mongoose.model<IStatus>('Status', statusSchema);

export default Status;

