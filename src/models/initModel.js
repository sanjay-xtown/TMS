import { User } from "../modules/user/user.model.js";
import { School } from "../modules/school/school.model.js";
import { Bus } from "../modules/bus/bus.model.js";
import { BusLog } from "../modules/bus/busLog.model.js";

const initModels = () => {
  // --- Relationships ---

  // School hasMany Buses
  School.hasMany(Bus, { foreignKey: "schoolId", as: "buses" });
  Bus.belongsTo(School, { foreignKey: "schoolId", as: "school" });

  // Bus hasMany Logs
  Bus.hasMany(BusLog, { foreignKey: "busId", as: "logs" });
  BusLog.belongsTo(Bus, { foreignKey: "busId", as: "bus" });

  console.log("✅ Models and relationships initialized");
};

export { User, School, Bus, initModels };
