import mongoose, { Schema, Document, Model } from 'mongoose';
import Event from './event.model';

/**
 * Interface representing the Booking document structure.
 */
export interface IBooking {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Regular expression for standard email validation.
 */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Mongoose Schema for the Booking model.
 */
const BookingSchema = new Schema<IBooking>({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required'],
    index: true // Index on eventId for faster booking queries by event
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    validate: {
      validator: (v: string) => emailRegex.test(v),
      message: (props: { value: string }) => `${props.value} is not a valid email address.`
    }
  }
}, {
  timestamps: true // Auto-generates and updates createdAt/updatedAt
});

/**
 * Pre-save hook to verify the referenced event actually exists in the database.
 * This acts as a database-level referential integrity check.
 */
BookingSchema.pre('save', async function () {
  const self = this as unknown as mongoose.HydratedDocument<IBooking>;
  // Verify that the event ID is associated with an existing Event document.
  const eventExists = await Event.findById(self.eventId);
  
  if (!eventExists) {
    throw new Error(`Referential Integrity Error: Referenced Event with ID "${self.eventId}" does not exist.`);
  }
});

// Compile and export the model, ensuring we reuse the compiled model if it exists in Next.js development context.
const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
