import * as busService from './bus.service.js';
import { createBusSchema, updateBusSchema } from './bus.schema.js';

export const createBus = async (req, res, next) => {
  try {
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
    const buses = await busService.getAllBuses(req.user?.role);
    res.status(200).json({
      status: 'success',
      count: buses.length,
      data: buses,
    });
  } catch (error) {
    next(error);
  }
};

export const getBusById = async (req, res, next) => {
  try {
    const bus = await busService.getBusById(req.params.id, req.user?.role);
    res.status(200).json({
      status: 'success',
      data: bus,
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
      message: 'Bus updated successfully',
      data: bus,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBus = async (req, res, next) => {
  try {
    await busService.deleteBus(req.params.id);
    res.status(200).json({
      status: 'success',
      message: 'Bus deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
