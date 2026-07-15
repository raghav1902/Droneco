const mongoose = require('mongoose');
const Student = require('../src/models/student.model');
const Fee = require('../src/models/fee.model');
require('dotenv').config();

const cleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // Find all students
    const students = await Student.find({});
    console.log(`Found ${students.length} total students.`);

    let orphanedCount = 0;

    for (const student of students) {
      const fees = await Fee.find({ student_id: student._id });
      if (fees.length === 0) {
        // Double check creation date (approx July 12th)
        const createdMonth = new Date(student.created_at || student._id.getTimestamp()).getMonth();
        if (createdMonth === 6) { // July is 6
          console.log(`Deleting orphaned student: ${student._id} (${student.personal_info?.first_name})`);
          await Student.deleteOne({ _id: student._id });
          orphanedCount++;
        }
      }
    }

    console.log(`Successfully cleaned up ${orphanedCount} orphaned students.`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

cleanup();
