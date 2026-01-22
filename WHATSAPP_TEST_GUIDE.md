# WhatsApp Alert Testing Guide

## Overview

Your project now has **TEST MODE** for WhatsApp alerts without needing real Meta Business Account credentials.

---

## Two Modes Available

### 🧪 TEST MODE (Current Default)
- **What it does**: Simulates sending messages
- **Messages are**: Logged to console + saved to file
- **Credentials needed**: None
- **Perfect for**: Development, testing, demos

### 🚀 PRODUCTION MODE
- **What it does**: Sends real WhatsApp messages via Meta API
- **Messages are**: Sent to officers' WhatsApp phones
- **Credentials needed**: Meta Business Account + credentials
- **Perfect for**: Live deployment

---

## Quick Start: Test WhatsApp Alerts

### Step 1: Run the Test Script

```bash
cd backend
npm install  # if not already done
node testAlertJob.js
```

### Step 2: What You'll See

The script will:
1. ✅ Connect to MongoDB
2. ✅ Create 3 test cases (30, 60, 75 days old)
3. ✅ Simulate sending 3 alert messages
4. ✅ Display each message in the console
5. ✅ Save all messages to `logs/whatsapp-test.log`

### Step 3: Check the Output

**Console Output:**
```
======================================================================
📱 [TEST MODE] WhatsApp Message Simulation
======================================================================
⏰ Time: 2026-01-22T10:30:45.123Z
📞 To: 919876543210
📋 Template: investigation_reminder_30
🔢 Parameters: FIR-TEST-30/2025
──────────────────────────────────────────────────────────────────
📝 MESSAGE CONTENT:
──────────────────────────────────────────────────────────────────
🚨 Investigation Reminder

FIR FIR-TEST-30/2025 Investigation Status
[Full message content...]
──────────────────────────────────────────────────────────────────
✅ Mock Message ID: mock_1234567890_abcd123
======================================================================
```

**Log File:**
```
logs/whatsapp-test.log
```
Contains JSON records of all simulated messages.

---

## Configuration

### Change Mode in `.env`

**For Test Mode (Default):**
```env
WHATSAPP_MODE=test
```

**For Production Mode:**
```env
WHATSAPP_MODE=production
WHATSAPP_TOKEN=your_actual_token_here
WHATSAPP_PHONE_ID=your_actual_phone_id_here
```

---

## Test Cases Created

The test script automatically creates these cases:

| FIR Number | Days Elapsed | Status | Alert Template |
|-----------|-------------|--------|-----------------|
| FIR-TEST-30/2025 | 30 | On Track | investigation_reminder_30 |
| FIR-TEST-60/2025 | 60 | Critical | investigation_critical_60 |
| FIR-TEST-75/2025 | 75 | Default | investigation_overdue |

---

## Message Templates Shown

### 1️⃣ Day 30 Alert
```
🚨 Investigation Reminder

FIR [Number] Investigation Status

Your investigation has been pending for 30 days...
```

### 2️⃣ Day 60 Alert
```
🚨 CRITICAL: Investigation Overdue

FIR [Number] - Investigation Status CRITICAL

Your investigation has exceeded 60 days!
Immediate action required.
```

### 3️⃣ Day 75+ Alert
```
🔴 OVERDUE: Investigation Severely Delayed

FIR [Number] - 75 Days Elapsed

Your investigation is severely overdue!
IMMEDIATE ESCALATION REQUIRED
```

---

## Switching to Production Mode

When you're ready to send real messages:

1. **Create Meta Business Account**
   - Visit [business.facebook.com](https://business.facebook.com)
   - Set up WhatsApp Business Account

2. **Create Message Templates**
   - Go to WhatsApp Manager → Message Templates
   - Create the 3 templates mentioned in the guide
   - Wait for Meta approval (2-24 hours)

3. **Get Credentials**
   - WHATSAPP_TOKEN: Permanent access token
   - WHATSAPP_PHONE_ID: Your phone number ID
   - WABA_ID: WhatsApp Business Account ID

4. **Update `.env`**
   ```env
   WHATSAPP_MODE=production
   WHATSAPP_TOKEN=your_token_here
   WHATSAPP_PHONE_ID=your_phone_id_here
   WABA_ID=your_waba_id_here
   ```

5. **Restart Server**
   ```bash
   npm run dev
   ```

Messages will now be sent automatically daily at 10 AM to officers' WhatsApp!

---

## Files Added/Modified

### New Files:
- ✅ `src/utils/whatsappTest.js` - Test message simulator
- ✅ `src/utils/whatsappConfig.js` - Mode switcher (test/production)
- ✅ `testAlertJob.js` - Test script to simulate alert job

### Modified Files:
- ✅ `src/jobs/dailyAlertJob.js` - Now uses config switcher
- ✅ `.env` - Added WHATSAPP_MODE variable

### Existing (Unchanged):
- ✅ `src/utils/whatsapp.js` - Real Meta API integration (still works)

---

## Testing Commands

```bash
# Run test alert job
cd backend
node testAlertJob.js

# View test messages log
cat logs/whatsapp-test.log

# Run in production mode (with real credentials)
WHATSAPP_MODE=production npm run dev
```

---

## Troubleshooting

### Issue: "Module not found: whatsappTest.js"
**Solution**: Make sure file exists at `backend/src/utils/whatsappTest.js`

### Issue: "Cannot create logs directory"
**Solution**: Manually create `backend/logs` folder or ensure write permissions

### Issue: Test messages not appearing
**Solution**: Check that `.env` has `WHATSAPP_MODE=test`

### Issue: Want to use real WhatsApp now
**Solution**: 
1. Get Meta credentials
2. Create templates
3. Change `.env` to `WHATSAPP_MODE=production`
4. Update credentials in `.env`
5. Restart server

---

## Next Steps

1. ✅ **Run the test**: `node testAlertJob.js`
2. ✅ **Check the logs**: View simulated messages
3. ✅ **Verify format**: Make sure messages look good
4. ⏳ **Later: Get Meta account** when ready for production
5. ⏳ **Deploy to production** with real credentials

---

## Questions?

- 📝 Test messages: Check `logs/whatsapp-test.log`
- 📞 Real messages: See main guide for Meta Business Account setup
- 🔧 Credentials: Reference `.env` file for required variables

Enjoy testing! 🚀
