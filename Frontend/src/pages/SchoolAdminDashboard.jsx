import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import { Bus, Activity, Users } from 'lucide-react';
import DataTable from '../components/DataTable';
import { studentService, busService } from '../services/api';

const SchoolAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeBuses: 0,
    totalBuses: 0,
    liveTrips: 0,
  });
  const [recentBuses, setRecentBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Runs on every mount — after login redirect, React mounts this fresh,
  // so useEffect always fires and fetches live data from the backend.
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Parallel fetch — allSettled so one failure doesn't block others
      const [studentsRes, busesRes] = await Promise.allSettled([
        studentService.getAll(),
        busService.getAll(),
      ]);

      const students =
        studentsRes.status === 'fulfilled' ? studentsRes.value.data.data ?? [] : [];
      const buses =
        busesRes.status === 'fulfilled' ? busesRes.value.data.data ?? [] : [];

      const activeBuses = buses.filter((b) => b.status === 'ACTIVE').length;

      setStats({
        totalStudents: students.length,
        totalBuses: buses.length,
        activeBuses,
        liveTrips: activeBuses,
      });

      setRecentBuses(buses.slice(0, 5));
    } catch (err) {
      console.error('SchoolAdmin dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const busColumns = [
    { label: 'Bus Number', key: 'busNumber' },
    { label: 'Driver', key: 'driverName' },
    { label: 'Route', key: 'routeName' },
    {
      label: 'Status',
      key: 'status',
      render: (val) => (
        <span className={`status-badge ${val === 'ACTIVE' ? 'active' : 'inactive'}`}>
          {val ?? 'ACTIVE'}
        </span>
      ),
    },
  ];

  return (
    <div className="dashboard-container">
      <Header title="School Overview" />

      <div className="content-area">
        <div className="stats-grid">
          <StatCard
            label="Total Students"
            value={loading ? '...' : stats.totalStudents}
            icon={<Users size={24} />}
            color="blue"
          />
          <StatCard
            label="Total Buses"
            value={loading ? '...' : stats.totalBuses}
            icon={<Bus size={24} />}
            color="orange"
          />
          <StatCard
            label="Active Buses"
            value={loading ? '...' : stats.activeBuses}
            icon={<Bus size={24} />}
            color="green"
          />
          <StatCard
            label="Live Trips"
            value={loading ? '...' : stats.liveTrips}
            icon={<Activity size={24} />}
            color="purple"
          />
        </div>

        <div style={{ marginTop: '30px' }}>
          <DataTable
            title="Recent Fleet Activity"
            columns={busColumns}
            data={recentBuses}
          />
        </div>
      </div>
    </div>
  );
};

export default SchoolAdminDashboard;
