const Case = require('../models/Case');

// @desc    Get station-wise analysis
// @route   GET /api/analytics/station-wise
// @access  Private (Admin)
exports.getStationWise = async (req, res) => {
  try {
    const stationStats = await Case.aggregate([
      {
        $group: {
          _id: '$policeStation',
          totalFIRs: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$isCompleted', false] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ['$isCompleted', true] }, 1, 0] } },
          onTrack: { $sum: { $cond: [{ $and: [{ $eq: ['$status', 'On Track'] }, { $eq: ['$isCompleted', false] }] }, 1, 0] } },
          critical: { $sum: { $cond: [{ $and: [{ $eq: ['$status', 'Critical'] }, { $eq: ['$isCompleted', false] }] }, 1, 0] } },
          default: { $sum: { $cond: [{ $and: [{ $eq: ['$status', 'Default'] }, { $eq: ['$isCompleted', false] }] }, 1, 0] } },
          avgDays: { $avg: '$daysElapsed' }
        }
      },
      {
        $project: {
          policeStation: '$_id',
          totalFIRs: 1,
          pending: 1,
          completed: 1,
          onTrack: 1,
          critical: 1,
          default: 1,
          avgDays: { $round: ['$avgDays', 0] }
        }
      },
      { $sort: { pending: -1 } }
    ]);
    
    res.status(200).json({
      success: true,
      data: stationStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching station-wise analysis',
      error: error.message
    });
  }
};

// @desc    Get IO-wise breakdown for a station
// @route   GET /api/analytics/station/:station/io-wise
// @access  Private (Admin)
exports.getIOWise = async (req, res) => {
  try {
    const { station } = req.params;
    
    const ioStats = await Case.aggregate([
      { $match: { policeStation: station } },
      {
        $group: {
          _id: '$ioName',
          totalCases: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$isCompleted', false] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ['$isCompleted', true] }, 1, 0] } },
          onTrack: { $sum: { $cond: [{ $and: [{ $eq: ['$status', 'On Track'] }, { $eq: ['$isCompleted', false] }] }, 1, 0] } },
          critical: { $sum: { $cond: [{ $and: [{ $eq: ['$status', 'Critical'] }, { $eq: ['$isCompleted', false] }] }, 1, 0] } },
          default: { $sum: { $cond: [{ $and: [{ $eq: ['$status', 'Default'] }, { $eq: ['$isCompleted', false] }] }, 1, 0] } },
          avgDays: { $avg: '$daysElapsed' }
        }
      },
      {
        $project: {
          ioName: '$_id',
          totalCases: 1,
          pending: 1,
          completed: 1,
          onTrack: 1,
          critical: 1,
          default: 1,
          avgDays: { $round: ['$avgDays', 0] }
        }
      },
      { $sort: { pending: -1 } }
    ]);
    
    res.status(200).json({
      success: true,
      station,
      data: ioStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching IO-wise analysis',
      error: error.message
    });
  }
};

// @desc    Get sub-division comparison
// @route   GET /api/analytics/subdivision-compare
// @access  Private (Admin)
exports.getSubDivisionCompare = async (req, res) => {
  try {
    const subDivStats = await Case.aggregate([
      {
        $group: {
          _id: '$subDivision',
          totalFIRs: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$isCompleted', false] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ['$isCompleted', true] }, 1, 0] } },
          avgDays: { $avg: '$daysElapsed' },
          excellent: { $sum: { $cond: [{ $eq: ['$quality', 'Excellent'] }, 1, 0] } },
          good: { $sum: { $cond: [{ $eq: ['$quality', 'Good'] }, 1, 0] } },
          default: { $sum: { $cond: [{ $eq: ['$quality', 'Default'] }, 1, 0] } }
        }
      },
      {
        $project: {
          subDivision: '$_id',
          totalFIRs: 1,
          pending: 1,
          completed: 1,
          avgDays: { $round: ['$avgDays', 0] },
          quality: {
            excellent: '$excellent',
            good: '$good',
            default: '$default'
          }
        }
      },
      { $sort: { subDivision: 1 } }
    ]);
    
    res.status(200).json({
      success: true,
      data: subDivStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sub-division comparison',
      error: error.message
    });
  }
};

// @desc    Get performance dashboard (quality of disposal)
// @route   GET /api/analytics/performance
// @access  Private (Admin)
exports.getPerformance = async (req, res) => {
  try {
    const performance = await Case.aggregate([
      {
        $group: {
          _id: null,
          totalCompleted: { $sum: { $cond: [{ $eq: ['$isCompleted', true] }, 1, 0] } },
          excellent: { $sum: { $cond: [{ $eq: ['$quality', 'Excellent'] }, 1, 0] } },
          good: { $sum: { $cond: [{ $eq: ['$quality', 'Good'] }, 1, 0] } },
          qualityDefault: { $sum: { $cond: [{ $eq: ['$quality', 'Default'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$isCompleted', false] }, 1, 0] } }
        }
      }
    ]);
    
    const result = performance[0] || {
      totalCompleted: 0,
      excellent: 0,
      good: 0,
      qualityDefault: 0,
      pending: 0
    };
    
    res.status(200).json({
      success: true,
      data: {
        total: result.totalCompleted + result.pending,
        completed: result.totalCompleted,
        pending: result.pending,
        quality: {
          excellent: result.excellent,
          good: result.good,
          default: result.qualityDefault
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching performance data',
      error: error.message
    });
  }
};
