import BusTransferLog from './transfer.model.js';
import Student from '../student/student.model.js';
import Tracking from '../tracking/tracking.model.js';
import { AppError } from '../../shared/errorHandling/errorHandler.js';
import sequelize from '../../config/db.js';

/**
 * Transfer a single student to a new bus permanently
 */
export const transferStudent = async (data) => {
  const { studentId, newBusId, reason, updatedBy } = data;

  const student = await Student.findByPk(studentId);
  if (!student) {
    throw new AppError('Student not found', 404);
  }

  const oldBusId = student.currentBusId;

  // Transaction for atomicity
  const result = await sequelize.transaction(async (t) => {
    // 1. Update Student
    await student.update({ currentBusId: newBusId }, { transaction: t });

    // 2. Create Transfer Log
    const log = await BusTransferLog.create({
      studentId,
      oldBusId,
      newBusId,
      reason,
      transferredBy: updatedBy || '00000000-0000-0000-0000-000000000000', // Default if not provided
    }, { transaction: t });

    return { student, log };
  });

  return result;
};

/**
 * Emergency transfer: Move all students from one bus to another (breakdown scenario)
 */
export const emergencyTransfer = async (data) => {
  const { oldBusId, newBusId, reason, status } = data;

  // 1. Find all students on the old bus
  const students = await Student.findAll({ where: { currentBusId: oldBusId } });
  
  if (students.length === 0) {
    // Still update the bus status even if no students are assigned
    await Tracking.update({ status: 'breakdown' }, { where: { busId: oldBusId } });
    return { message: 'Bus status updated to breakdown. No students were assigned to this bus.' };
  }

  const result = await sequelize.transaction(async (t) => {
    // 2. Update all students to new bus
    await Student.update(
      { currentBusId: newBusId },
      { where: { currentBusId: oldBusId }, transaction: t }
    );

    // 3. Update old bus status to breakdown
    await Tracking.update(
      { status: 'breakdown' },
      { where: { busId: oldBusId }, transaction: t }
    );

    // 4. Create transfer logs for each student
    const logs = students.map(student => ({
      studentId: student.id,
      oldBusId,
      newBusId,
      reason: `EMERGENCY: ${reason}`,
      transferredBy: '00000000-0000-0000-0000-000000000000', // System/Admin
    }));

    await BusTransferLog.bulkCreate(logs, { transaction: t });

    return { count: students.length };
  });

  return result;
};
