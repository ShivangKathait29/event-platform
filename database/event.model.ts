import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface representing the Event document structure.
 */
export interface IEvent {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: 'online' | 'offline' | 'hybrid';
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Custom validator to ensure string fields are not empty or just whitespace.
 */
const nonEmptyStringValidator = {
  validator: (v: string) => v.trim().length > 0,
  message: (props: { path: string }) => `Field "${props.path}" cannot be empty or contain only whitespace.`
};

/**
 * Mongoose Schema for the Event model.
 */
const EventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    validate: nonEmptyStringValidator
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    validate: nonEmptyStringValidator
  },
  overview: {
    type: String,
    required: [true, 'Overview is required'],
    trim: true,
    validate: nonEmptyStringValidator
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true,
    validate: nonEmptyStringValidator
  },
  venue: {
    type: String,
    required: [true, 'Venue is required'],
    trim: true,
    validate: nonEmptyStringValidator
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    validate: nonEmptyStringValidator
  },
  date: {
    type: String,
    required: [true, 'Date is required'],
    trim: true,
    validate: nonEmptyStringValidator
  },
  time: {
    type: String,
    required: [true, 'Time is required'],
    trim: true,
    validate: nonEmptyStringValidator
  },
  mode: {
    type: String,
    required: [true, 'Mode is required'],
    enum: {
      values: ['online', 'offline', 'hybrid'],
      message: '{VALUE} is not a valid mode (online, offline, hybrid)'
    },
    trim: true
  },
  audience: {
    type: String,
    required: [true, 'Audience is required'],
    trim: true,
    validate: nonEmptyStringValidator
  },
  agenda: {
    type: [String],
    required: [true, 'Agenda is required'],
    validate: {
      validator: (v: string[]) => Array.isArray(v) && v.length > 0 && v.every(item => item.trim().length > 0),
      message: 'Agenda must contain at least one non-empty string item.'
    }
  },
  organizer: {
    type: String,
    required: [true, 'Organizer is required'],
    trim: true,
    validate: nonEmptyStringValidator
  },
  tags: {
    type: [String],
    required: [true, 'Tags are required'],
    validate: {
      validator: (v: string[]) => Array.isArray(v) && v.length > 0 && v.every(item => item.trim().length > 0),
      message: 'Tags must contain at least one non-empty string item.'
    }
  }
}, {
  timestamps: true // Auto-generates and updates createdAt/updatedAt
});

/**
 * Helper to slugify the title.
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word/non-whitespace/non-hyphen characters
    .replace(/[\s_]+/g, '-')  // Replace spaces/underscores with a single hyphen
    .replace(/-+/g, '-')      // Replace multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, ''); // Trim hyphens from the start and end
}

/**
 * Pre-save hook to generate slug, validate/normalize date to ISO format, and format time consistently.
 */
EventSchema.pre('save', async function () {
  const self = this as unknown as mongoose.HydratedDocument<IEvent>;

  // 1. Validate that required string fields are not empty/whitespace
  const requiredFields: (keyof IEvent)[] = [
    'title', 'description', 'overview', 'image', 'venue', 'location',
    'date', 'time', 'mode', 'audience', 'organizer'
  ];

  for (const field of requiredFields) {
    const val = self.get(field);
    if (typeof val === 'string' && val.trim().length === 0) {
      throw new Error(`Validation failed: Field "${field}" cannot be empty or only whitespace.`);
    }
  }

  // 2. Generate slug if the title is modified
  if (self.isModified('title')) {
    self.slug = generateSlug(self.title);
  }

  // 3. Validate and normalize date to ISO format
  if (self.isModified('date')) {
    const parsedDate = new Date(self.date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error(`Validation failed: "${self.date}" is not a valid date format.`);
    }
    self.date = parsedDate.toISOString();
  }

  // 4. Normalize time format (trim spacing and standardize case of AM/PM)
  if (self.isModified('time')) {
    self.time = self.time
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/am/gi, 'AM')
      .replace(/pm/gi, 'PM');
  }
});

// Compile and export the model, ensuring we reuse the compiled model if it exists in Next.js development context.
const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
