import { useState } from "react";
import LoginPage from "./modules/auth/pages/LoginPage";
import SuperAdminDashboard from "./modules/superadmin/pages/SuperAdminDashboard";
import SchoolAdminDashboard from "./modules/schooladmin/pages/SchoolAdminDashboard";

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="min-h-screen">
      {!user ? (
        <LoginPage setUser={setUser} />
      ) : user.role === "superadmin" ? (
        <SuperAdminDashboard />
      ) : (
        <SchoolAdminDashboard />
      )}
    </div>
  );
}