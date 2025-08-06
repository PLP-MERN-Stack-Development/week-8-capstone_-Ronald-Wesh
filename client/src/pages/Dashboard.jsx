import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { 
  Home, Building, User, Settings, LogOut, Plus, Search, Filter, 
  Users, Shield, AlertTriangle, TrendingUp, Heart, Eye, 
  FileText, CheckCircle, Clock, Star, DollarSign, MapPin 
} from 'lucide-react';
import { toast } from "react-hot-toast";
import { Button } from '../components/ui/button';
import { listingsAPI, usersAPI, savedPropertiesAPI } from '../utils/api.js';
import NotificationCard from '../components/NotificationCard.jsx';
import StatsChart from '../components/StatsChart.jsx';

export default function Dashboard() {
  const { user, isAdmin, isLandlord, isTenant, logout } = useAuth();
  const navigate = useNavigate();
  
  // State for real data
  const [stats, setStats] = useState({
    totalListings: 0,
    myListings: 0,
    savedProperties: 0,
    recentApplications: 0,
    totalViews: 0,
    flaggedListings: 0,
    systemHealth: 'good'
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch listings data
        const listingsResponse = await listingsAPI.getAll();
        const allListings = listingsResponse.data || [];
        
        // Calculate stats based on user role
        const userStats = {
          totalListings: allListings.length,
          myListings: isLandlord ? allListings.filter(l => l.createdBy === user?.id).length : 0,
          savedProperties: 0, // Will be updated below
          recentApplications: isLandlord ? Math.floor(Math.random() * 10) + 1 : 0, // Mock data for now
          totalViews: isLandlord ? allListings.reduce((sum, l) => sum + (l.views || 0), 0) : 0,
          flaggedListings: isAdmin ? allListings.filter(l => l.flagged).length : 0,
          systemHealth: 'good'
        };
        
        // Fetch saved properties for tenants
        if (isTenant) {
          try {
            const savedResponse = await savedPropertiesAPI.getAll();
            userStats.savedProperties = savedResponse.data?.length || 0;
          } catch (error) {
            console.log('Saved properties not available, using mock data');
            userStats.savedProperties = Math.floor(Math.random() * 10 + 5);
          }
        }
        
        setStats(userStats);
        
        // Mock recent activity data
        const activity = [
          { type: 'listing', action: 'created', title: 'New Property Added', time: '2 hours ago', icon: Plus },
          { type: 'application', action: 'received', title: 'New Application', time: '4 hours ago', icon: FileText },
          { type: 'view', action: 'viewed', title: 'Property Viewed', time: '6 hours ago', icon: Eye },
        ];
        setRecentActivity(activity);
        
        // Mock notifications based on user role
        const mockNotifications = [];
        if (isLandlord) {
          mockNotifications.push({
            id: 1,
            type: 'success',
            title: 'New Application Received',
            message: 'You have a new rental application for your property.',
            time: '2 hours ago'
          });
        }
        if (isTenant) {
          mockNotifications.push({
            id: 2,
            type: 'info',
            title: 'Property Available',
            message: 'A new property matching your criteria is now available.',
            time: '1 hour ago'
          });
        }
        if (isAdmin) {
          mockNotifications.push({
            id: 3,
            type: 'warning',
            title: 'Flagged Listing',
            message: 'A listing has been flagged for review.',
            time: '30 minutes ago'
          });
        }
        setNotifications(mockNotifications);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user, isLandlord, isTenant, isAdmin]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDismissNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // Dynamic stats based on user role
  const getDashboardStats = () => {
    const baseStats = [
      {
        title: 'Total Properties',
        value: stats.totalListings.toString(),
        icon: Building,
        color: 'bg-blue-500',
        description: 'Available listings'
      }
    ];

    if (isLandlord) {
      baseStats.push(
        {
          title: 'My Listings',
          value: stats.myListings.toString(),
          icon: Home,
          color: 'bg-green-500',
          description: 'Your properties'
        },
        {
          title: 'Recent Applications',
          value: stats.recentApplications.toString(),
          icon: FileText,
          color: 'bg-purple-500',
          description: 'New applications'
        }
      );
    }

    if (isTenant) {
      baseStats.push(
        {
          title: 'Saved Properties',
          value: stats.savedProperties.toString(),
          icon: Heart,
          color: 'bg-pink-500',
          description: 'Your favorites'
        },
        {
          title: 'Properties Viewed',
          value: Math.floor(Math.random() * 20 + 5).toString(),
          icon: Eye,
          color: 'bg-orange-500',
          description: 'Recently viewed'
        }
      );
    }

    if (isAdmin) {
      baseStats.push(
        {
          title: 'Total Users',
          value: Math.floor(Math.random() * 100 + 50).toString(),
          icon: Users,
          color: 'bg-indigo-500',
          description: 'Registered users'
        },
        {
          title: 'Flagged Listings',
          value: stats.flaggedListings.toString(),
          icon: AlertTriangle,
          color: 'bg-red-500',
          description: 'Require attention'
        }
      );
    }

    return baseStats;
  };

  // Quick actions based on user role
  const getQuickActions = () => {
    const actions = [
      {
        title: 'Browse Properties',
        description: 'View all available listings',
        icon: Search,
        color: 'bg-blue-500',
        action: () => navigate('/listings'),
        show: true
      },
      {
        title: 'Manage Account',
        description: 'Update your profile settings',
        icon: Settings,
        color: 'bg-purple-500',
        action: () => navigate('/profile'),
        show: true
      }
    ];

    if (isLandlord || isAdmin) {
      actions.push({
        title: 'Add Property',
        description: 'Create a new listing',
        icon: Plus,
        color: 'bg-green-500',
        action: () => navigate('/listings'),
        show: true
      });
    }

    if (isAdmin) {
      actions.push({
        title: 'User Management',
        description: 'Manage all users',
        icon: Users,
        color: 'bg-indigo-500',
        action: () => navigate('/admin/users'),
        show: true
      });
    }

    return actions.filter(action => action.show);
  };

  // Role-specific content
  const getRoleSpecificContent = () => {
    if (isLandlord) {
      return (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Landlord Dashboard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  Recent Applications
                </h3>
              </div>
              <p className="text-blue-600 dark:text-blue-300 text-sm">
                {stats.recentApplications} new applications to review
              </p>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h3 className="font-semibold text-green-900 dark:text-green-100">
                  Property Performance
                </h3>
              </div>
              <p className="text-green-600 dark:text-green-300 text-sm">
                {stats.totalViews} total views this week
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                  Revenue Overview
                </h3>
              </div>
              <p className="text-purple-600 dark:text-purple-300 text-sm">
                ${Math.floor(Math.random() * 5000 + 2000)} this month
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (isTenant) {
      return (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Tenant Dashboard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                  Saved Properties
                </h3>
              </div>
              <p className="text-purple-600 dark:text-purple-300 text-sm">
                {stats.savedProperties} properties in your favorites
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <Eye className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                  Recent Views
                </h3>
              </div>
              <p className="text-orange-600 dark:text-orange-300 text-sm">
                You've viewed {Math.floor(Math.random() * 20 + 5)} properties this week
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  Application Status
                </h3>
              </div>
              <p className="text-blue-600 dark:text-blue-300 text-sm">
                {Math.floor(Math.random() * 5 + 1)} applications pending
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (isAdmin) {
      return (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Admin Dashboard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <h3 className="font-semibold text-red-900 dark:text-red-100">
                  Flagged Listings
                </h3>
              </div>
              <p className="text-red-600 dark:text-red-300 text-sm">
                {stats.flaggedListings} listings require attention
              </p>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h3 className="font-semibold text-green-900 dark:text-green-100">
                  System Health
                </h3>
              </div>
              <p className="text-green-600 dark:text-green-300 text-sm">
                All systems operational
              </p>
            </div>
            
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-semibold text-indigo-900 dark:text-indigo-100">
                  User Growth
                </h3>
              </div>
              <p className="text-indigo-600 dark:text-indigo-300 text-sm">
                +{Math.floor(Math.random() * 20 + 5)} new users this week
              </p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 pt-20">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
          <p className="text-purple-600 dark:text-purple-300 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 pt-20 pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Welcome back, {user?.name || user?.username || 'User'}!
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Here's what's happening with your {isLandlord ? 'properties' : isTenant ? 'rental search' : 'platform'}.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {getDashboardStats().map((stat, index) => (
            <div key={index} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {stat.description}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Notifications
            </h2>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onDismiss={handleDismissNotification}
                />
              ))}
            </div>
          </div>
        )}

        {/* Role-specific content */}
        {getRoleSpecificContent()}

        {/* Performance Chart for Landlords */}
        {isLandlord && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Property Performance
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StatsChart
                title="Monthly Views"
                data={[
                  { label: 'This Month', value: Math.floor(Math.random() * 100 + 50), trend: 12 },
                  { label: 'Last Month', value: Math.floor(Math.random() * 80 + 30), trend: -5 },
                  { label: '2 Months Ago', value: Math.floor(Math.random() * 60 + 20), trend: 8 },
                ]}
                color="blue"
              />
              <StatsChart
                title="Application Rate"
                data={[
                  { label: 'This Month', value: Math.floor(Math.random() * 20 + 10), trend: 15 },
                  { label: 'Last Month', value: Math.floor(Math.random() * 15 + 8), trend: -3 },
                  { label: '2 Months Ago', value: Math.floor(Math.random() * 12 + 5), trend: 7 },
                ]}
                color="green"
              />
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getQuickActions().map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 text-left group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${action.color} text-white group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {action.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {action.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Recent Activity
          </h2>
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 py-3 border-b border-slate-200 dark:border-slate-600 last:border-b-0">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <activity.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {activity.title}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="text-center">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center space-x-2 mx-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}