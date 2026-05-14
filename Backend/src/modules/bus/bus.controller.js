import * as busService from './bus.service.js';
import { createBusSchema, updateBusSchema } from './bus.schema.js';

export const createBus = async (req, res, next) => {
  try {
    // Auto-inject schoolId for school_admin
    if (req.user?.role === 'school_admin' && req.user.schoolId) {
      req.body.schoolId = req.user.schoolId;
    }

    const busData = createBusSchema.parse(req.body);
    const bus = await busService.createBus(busData);

    res.status(201).json({
      status: 'success',
      message: 'Bus created successfully',
      data: bus,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBuses = async (req, res, next) => {
  try {
    const filters = {};
    if (req.user?.role === 'school_admin') {
      filters.schoolId = req.user.schoolId;
    }
    const buses = await busService.getBuses(filters);
    res.status(200).json({
      status: 'success',
      results: buses.length,
      data: buses,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBus = async (req, res, next) => {
  try {
    const busData = updateBusSchema.parse(req.body);
    const bus = await busService.updateBus(req.params.id, busData);
    res.status(200).json({
      status: 'success',
      data: bus,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBus = async (req, res, next) => {
  try {
    await busService.deleteBus(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
