import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'default';

  if (!user) return null;

  const role = user.role;

  const isLinkActive = (tabName, isDefault = false) => {
    if (activeTab === tabName) return 'active';
    if (isDefault && activeTab === 'default') return 'active';
    return '';
  };

  return (
    <div className="sidebar">
      <div className="sidebar-title">{role} Menu</div>
      
      {role === 'tenant' && (
        <>
          <Link to="/dashboard?tab=profile" className={`sidebar-link ${isLinkActive('profile', true)}`}>
            <i className="fa-solid fa-user"></i> My Profile
          </Link>
          <Link to="/dashboard?tab=favorites" className={`sidebar-link ${isLinkActive('favorites')}`}>
            <i className="fa-solid fa-heart"></i> Saved Favorites
          </Link>
          <Link to="/dashboard?tab=inquiries" className={`sidebar-link ${isLinkActive('inquiries')}`}>
            <i className="fa-solid fa-envelope"></i> Sent Inquiries
          </Link>
        </>
      )}

      {role === 'owner' && (
        <>
          <Link to="/dashboard?tab=listings" className={`sidebar-link ${isLinkActive('listings', true)}`}>
            <i className="fa-solid fa-house"></i> My Listings
          </Link>
          <Link to="/dashboard?tab=add-property" className={`sidebar-link ${isLinkActive('add-property')}`}>
            <i className="fa-solid fa-circle-plus"></i> Add Property
          </Link>
          <Link to="/dashboard?tab=inquiries" className={`sidebar-link ${isLinkActive('inquiries')}`}>
            <i className="fa-solid fa-envelope"></i> Received Inquiries
          </Link>
          <Link to="/dashboard?tab=profile" className={`sidebar-link ${isLinkActive('profile')}`}>
            <i className="fa-solid fa-user-gears"></i> Account Profile
          </Link>
        </>
      )}

      {role === 'admin' && (
        <>
          <Link to="/dashboard?tab=stats" className={`sidebar-link ${isLinkActive('stats', true)}`}>
            <i className="fa-solid fa-chart-pie"></i> System Stats
          </Link>
          <Link to="/dashboard?tab=properties" className={`sidebar-link ${isLinkActive('properties')}`}>
            <i className="fa-solid fa-list-check"></i> Review Listings
          </Link>
          <Link to="/dashboard?tab=users" className={`sidebar-link ${isLinkActive('users')}`}>
            <i className="fa-solid fa-users"></i> Manage Users
          </Link>
          <Link to="/dashboard?tab=profile" className={`sidebar-link ${isLinkActive('profile')}`}>
            <i className="fa-solid fa-user-shield"></i> My Profile
          </Link>
        </>
      )}
    </div>
  );
};

export default Sidebar;
