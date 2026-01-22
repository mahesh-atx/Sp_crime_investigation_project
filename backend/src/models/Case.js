const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  // FIR Details
  firNumber: {
    type: String,
    required: [true, 'FIR Number is required'],
    unique: true,
    trim: true
  },
  firDate: {
    type: Date,
    required: [true, 'FIR Date is required']
  },
  
  // Location Details
  policeStation: {
    type: String,
    required: [true, 'Police Station is required']
  },
  subDivision: {
    type: String,
    required: [true, 'Sub-Division is required']
  },
  
  // IO Details
  ioName: {
    type: String,
    required: [true, 'IO Name is required']
  },
  ioPhone: {
    type: String,
    required: [true, 'IO Phone is required']
  },
  
  // Crime Details
  sections: {
    type: String,
    required: [true, 'Sections (IPC/BNNS) are required']
  },
  crimeBrief: {
    type: String,
    required: [true, 'Crime brief is required']
  },
  
  // Auto-calculated Investigation Status
  daysElapsed: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['On Track', 'Critical', 'Default'],
    default: 'On Track'
  },
  quality: {
    type: String,
    enum: ['Excellent', 'Good', 'Default', 'Pending'],
    default: 'Pending'
  },
  
  // CC Details (Investigation Completion)
  ccNumber: {
    type: String,
    default: ''
  },
  ccDate: {
    type: Date
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  
  // e-Sakshi & FSL
  eSakshiId: {
    type: String,
    default: ''
  },
  eSakshiStatus: {
    type: String,
    enum: ['Completed', 'Pending', 'N/A'],
    default: 'Pending'
  },
  fslVisit: {
    type: String,
    enum: ['YES', 'NO'],
    default: 'NO'
  },
  
  // Created by
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Calculate days elapsed and status before saving
caseSchema.pre('save', function(next) {
  if (this.firDate) {
    const today = this.isCompleted && this.ccDate ? new Date(this.ccDate) : new Date();
    const firDate = new Date(this.firDate);
    const diffTime = today - firDate;
    this.daysElapsed = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    
    // Auto status calculation (for pending cases)
    if (!this.isCompleted) {
      if (this.daysElapsed <= 30) {
        this.status = 'On Track';
      } else if (this.daysElapsed <= 60) {
        this.status = 'Critical';
      } else {
        this.status = 'Default';
      }
      this.quality = 'Pending';
    } else {
      // Quality calculation (for completed cases)
      if (this.daysElapsed <= 30) {
        this.quality = 'Excellent';
      } else if (this.daysElapsed <= 60) {
        this.quality = 'Good';
      } else {
        this.quality = 'Default';
      }
      this.status = 'Completed';
    }
  }
  
  next();
});

// Static method to update all cases' days elapsed
caseSchema.statics.updateAllDaysElapsed = async function() {
  const cases = await this.find({ isCompleted: false });
  for (let caseDoc of cases) {
    await caseDoc.save(); // Triggers pre-save hook
  }
};

module.exports = mongoose.model('Case', caseSchema);
