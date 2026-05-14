import { 
  LayoutDashboard, 
  School, 
  Users, 
  Settings, 
  BarChart3,
  UserCheck,
  Bus,
  MapPin,
  Navigation,
  ArrowLeftRight,
  Bell,
  ClipboardList,
  Activity
} from 'lucide-react';
import { ROUTES } from './routes';

export const SUPERADMIN_MENU = [
  { label: 'Dashboard', path: ROUTES.SUPERADMIN_DASHBOARD, icon: LayoutDashboard },
  { label: 'Schools', path: ROUTES.SCHOOL_MANAGEMENT, icon: School },
  { label: 'Admins', path: ROUTES.ADMIN_MANAGEMENT, icon: Users },
  { label: 'Reports', path: ROUTES.REPORTS_ANALYTICS, icon: BarChart3 },
  { label: 'Settings', path: ROUTES.PLATFORM_SETTINGS, icon: Settings },
];

export const SCHOOLADMIN_MENU = [
  { label: 'Dashboard', path: ROUTES.SCHOOLADMIN_DASHBOARD, icon: LayoutDashboard },
  { label: 'Students', path: ROUTES.STUDENT_MANAGEMENT, icon: UserCheck },
  { label: 'Parents', path: ROUTES.PARENT_MANAGEMENT, icon: Users },
  { label: 'Buses', path: ROUTES.BUS_MANAGEMENT, icon: Bus },
  { label: 'Drivers', path: ROUTES.DRIVER_MANAGEMENT, icon: Navigation },
  { label: 'Routes', path: ROUTES.ROUTE_MANAGEMENT, icon: MapPin },
  { label: 'Live Tracking', path: ROUTES.LIVE_TRACKING, icon: Activity },
  { label: 'Transfers', path: ROUTES.TRANSFER_MANAGEMENT, icon: ArrowLeftRight },
  { label: 'Notifications', path: ROUTES.NOTIFICATION_MANAGEMENT, icon: Bell },
  { label: 'Reports', path: ROUTES.SCHOOL_REPORTS, icon: ClipboardList },
];
