const Case = require('../models/Case');

// @desc    Get all cases with filters
// @route   GET /api/cases
// @access  Private
exports.getCases = async (req, res) => {
  try {
    const { status, policeStation, subDivision, ioName, isCompleted } = req.query;
    
    // Build query
    let query = {};
    
    // If officer, only show their station's cases
    if (req.user.role === 'officer') {
      query.policeStation = req.user.policeStation;
    }
    
    // Apply filters
    if (status) query.status = status;
    if (policeStation) query.policeStation = policeStation;
    if (subDivision) query.subDivision = subDivision;
    if (ioName) query.ioName = { $regex: ioName, $options: 'i' };
    if (isCompleted !== undefined) query.isCompleted = isCompleted === 'true';
    
    const cases = await Case.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name');
    
    res.status(200).json({
      success: true,
      count: cases.length,
      data: cases
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cases',
      error: error.message
    });
  }
};

// @desc    Get single case
// @route   GET /api/cases/:id
// @access  Private
exports.getCase = async (req, res) => {
  try {
    const caseDoc = await Case.findById(req.params.id).populate('createdBy', 'name');
    
    if (!caseDoc) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: caseDoc
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching case',
      error: error.message
    });
  }
};

// @desc    Create new case
// @route   POST /api/cases
// @access  Private
exports.createCase = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    
    const caseDoc = await Case.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Case created successfully',
      data: caseDoc
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating case',
      error: error.message
    });
  }
};

// @desc    Update case
// @route   PUT /api/cases/:id
// @access  Private
exports.updateCase = async (req, res) => {
  try {
    let caseDoc = await Case.findById(req.params.id);
    
    if (!caseDoc) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }
    
    // Officers can only update their station's cases
    if (req.user.role === 'officer' && caseDoc.policeStation !== req.user.policeStation) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this case'
      });
    }
    
    caseDoc = await Case.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      message: 'Case updated successfully',
      data: caseDoc
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating case',
      error: error.message
    });
  }
};

// @desc    Mark case as completed
// @route   PATCH /api/cases/:id/complete
// @access  Private
exports.completeCase = async (req, res) => {
  try {
    const { ccNumber, ccDate } = req.body;
    
    let caseDoc = await Case.findById(req.params.id);
    
    if (!caseDoc) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }
    
    caseDoc.ccNumber = ccNumber;
    caseDoc.ccDate = ccDate || new Date();
    caseDoc.isCompleted = true;
    
    await caseDoc.save();
    
    res.status(200).json({
      success: true,
      message: 'Case marked as completed',
      data: caseDoc
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing case',
      error: error.message
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/cases/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    let matchQuery = {};
    
    // If officer, only their station
    if (req.user.role === 'officer') {
      matchQuery.policeStation = req.user.policeStation;
    }
    
    const totalCases = await Case.countDocuments(matchQuery);
    const pendingCases = await Case.countDocuments({ ...matchQuery, isCompleted: false });
    const completedCases = await Case.countDocuments({ ...matchQuery, isCompleted: true });
    const onTrack = await Case.countDocuments({ ...matchQuery, status: 'On Track', isCompleted: false });
    const critical = await Case.countDocuments({ ...matchQuery, status: 'Critical', isCompleted: false });
    const defaultCases = await Case.countDocuments({ ...matchQuery, status: 'Default', isCompleted: false });
    
    // Average days
    const avgResult = await Case.aggregate([
      { $match: { ...matchQuery, isCompleted: false } },
      { $group: { _id: null, avgDays: { $avg: '$daysElapsed' } } }
    ]);
    const avgDays = avgResult.length > 0 ? Math.round(avgResult[0].avgDays) : 0;
    
    // Quality distribution for completed cases
    const excellent = await Case.countDocuments({ ...matchQuery, quality: 'Excellent', isCompleted: true });
    const good = await Case.countDocuments({ ...matchQuery, quality: 'Good', isCompleted: true });
    const qualityDefault = await Case.countDocuments({ ...matchQuery, quality: 'Default', isCompleted: true });
    
    res.status(200).json({
      success: true,
      data: {
        total: totalCases,
        pending: pendingCases,
        completed: completedCases,
        onTrack,
        critical,
        default: defaultCases,
        avgDays,
        quality: {
          excellent,
          good,
          default: qualityDefault
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message
    });
  }
};
