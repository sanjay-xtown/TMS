import { User } from "../modules/user/user.model.js";
import { School } from "../modules/school/school.model.js";
import { Bus } from "../modules/bus/bus.model.js";

const initModels = () => {
  // --- Relationships ---

  // School hasMany Buses
  School.hasMany(Bus, { foreignKey: "schoolId", as: "buses" });
  Bus.belongsTo(School, { foreignKey: "schoolId", as: "school" });

  console.log("✅ Models and relationships initialized");
};

export { User, School, Bus, initModels };
