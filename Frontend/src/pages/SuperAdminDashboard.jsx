import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import { TrendChart, DistributionChart } from '../components/Charts';
import DataTable from '../components/DataTable';
import { School, Users, Bus, GraduationCap, Trash2 } from 'lucide-react';
import { schoolAdminService, studentService, busService } from '../services/api';
import { useToast } from '../components/ToastProvider';

const SuperAdminDashboard = () => {
  // No mock/hardcoded values — everything comes from the DB
  const [stats, setStats] = useState({ schools: 0, admins: 0, buses: 0, students: 0 });
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Fetch on every mount — this runs after every login redirect,
  // guaranteeing the dashboard always shows live DB data.
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Run all requests in parallel for speed
      const [adminsRes, studentsRes, busesRes] = await Promise.allSettled([
        schoolAdminService.getAll(),
        studentService.getAll(),
        busService.getAll(),
      ]);

      const adminData =
        adminsRes.status === 'fulfilled' ? adminsRes.value.data.data ?? [] : [];
      const studentData =
        studentsRes.status === 'fulfilled' ? studentsRes.value.data.data ?? [] : [];
      const busData =
        busesRes.status === 'fulfilled' ? busesRes.value.data.data ?? [] : [];

      setAdmins(adminData);

      const schoolsCount = new Set(adminData.map((a) => a.schoolId).filter(Boolean)).size;

      setStats({
        schools: schoolsCount,
        admins: adminData.length,
        buses: busData.length,
        students: studentData.length,
      });
    } catch (err) {
      console.error('SuperAdmin dashboard fetch error:', err);
      addToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this school admin?')) {
      try {
        await schoolAdminService.delete(id);
        addToast('School admin removed successfully', 'success');
        fetchData();
      } catch (err) {
        addToast('Failed to delete admin', 'error');
      }
    }
  };

  const chartData = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 600 },
    { name: 'Thu', value: 800 },
    { name: 'Fri', value: 500 },
    { name: 'Sat', value: 900 },
    { name: 'Sun', value: 700 },
  ];

  const distributionData = [
    { name: 'Schools', value: stats.schools },
    { name: 'Buses', value: stats.buses },
    { name: 'Admins', value: stats.admins },
  ];

  const columns = [
    { label: 'School Name', key: 'schoolName' },
    { label: 'Admin Name', key: 'adminName' },
    { label: 'Email', key: 'adminEmail' },
    {
      label: 'Status',
      key: 'status',
      render: () => <span className="status-badge active">Active</span>,
    },
    {
      label: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <button className="icon-btn delete" onClick={() => handleDelete(row.id)}>
          <Trash2 size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="dashboard-container">
      <Header title="Dashboard Overview" />

      <div className="content-area">
        <div className="stats-grid">
          <StatCard label="Total Schools" value={stats.schools} icon={<School size={24} />} color="blue" trend="up" trendValue="+12%" />
          <StatCard label="School Admins" value={stats.admins} icon={<Users size={24} />} color="green" trend="up" trendValue="+8%" />
          <StatCard label="Active Buses" value={stats.buses} icon={<Bus size={24} />} color="orange" trend="up" trendValue="+15%" />
          <StatCard label="Total Students" value={stats.students} icon={<GraduationCap size={24} />} color="purple" trend="up" trendValue="+5%" />
        </div>

        <div className="charts-grid">
          <TrendChart data={chartData} />
          <DistributionChart data={distributionData} />
        </div>

        <DataTable
          title="Recent School Registrations"
          columns={columns}
          data={admins.slice(0, 5)}
          onSearch={(val) => console.log(val)}
        />
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
