import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  // Basic Company Info
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10,15}$/, 'Please enter a valid phone number'],
  },
  backImage: {
    type: String,
    default: '',
  },
  logo: {
    type: String, // URL to the logo image
    default: '',
  },

  // Business Details
  businessType: {
    type: String,
    enum: ['Manufacturer', 'Retailer', 'Wholesaler', 'Handmade', 'Other'],
    required: true,
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  // Address
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
  },

  // Social Media (Optional)
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String,
  },

  // Verification & Status
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update 'updatedAt' on save
companySchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Company = mongoose.model('Company', companySchema);
export default Company;