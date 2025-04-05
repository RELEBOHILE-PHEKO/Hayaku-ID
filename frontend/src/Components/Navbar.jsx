import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isAuthenticated } = useSelector((state) => state.user);
    const notifications = useSelector((state) => state.notifications?.items || []);
    const unreadCount = notifications.filter(notification => !notification.isRead).length;

    useEffect(() => {
        // Close menus when location changes
        setIsMenuOpen(false);
        setIsNotificationsOpen(false);
        setIsProfileMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (isNotificationsOpen) setIsNotificationsOpen(false);
        if (isProfileMenuOpen) setIsProfileMenuOpen(false);
    };

    const toggleNotifications = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
        if (isMenuOpen) setIsMenuOpen(false);
        if (isProfileMenuOpen) setIsProfileMenuOpen(false);
    };

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
        if (isMenuOpen) setIsMenuOpen(false);
        if (isNotificationsOpen) setIsNotificationsOpen(false);
    };

    // Don't show navbar on login page
    if (location.pathname === '/login') return null;

    return (
        <nav className="bg-primary text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and main navigation */}
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex-shrink-0 flex items-center">

                            <span className="ml-2 text-xl font-bold">HayakuID</span>
                        </Link>

                        {/* Desktop navigation */}
                        <div className="hidden md:ml-6 md:flex md:space-x-4">
                            <Link
                                to="/dashboard"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    location.pathname === '/dashboard' ? 'bg-primary-dark' : 'hover:bg-primary-light'
                                }`}
                            >
                                Dashboard
                            </Link>

                            <Link
                                to="/application"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    location.pathname.startsWith('/application') ? 'bg-primary-dark' : 'hover:bg-primary-light'
                                }`}
                            >
                                Apply
                            </Link>

                            <Link
                                to="/profile"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    location.pathname === '/profile' ? 'bg-primary-dark' : 'hover:bg-primary-light'
                                }`}
                            >
                                Profile
                            </Link>

                            {user?.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                                        location.pathname.startsWith('/admin') ? 'bg-primary-dark' : 'hover:bg-primary-light'
                                    }`}
                                >
                                    Admin
                                </Link>
                            )}

                            <Link
                                to="/help"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    location.pathname === '/help' ? 'bg-primary-dark' : 'hover:bg-primary-light'
                                }`}
                            >
                                Help
                            </Link>
                        </div>
                    </div>

                    {/* Right side - notifications, profile, etc. */}
                    <div className="flex items-center">
                        {/* Notifications */}
                        <div className="ml-3 relative">
                            <button
                                type="button"
                                className="p-1 rounded-full text-white hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white"
                                onClick={toggleNotifications}
                            >
                                <span className="sr-only">View notifications</span>
                                <svg
                                    className="h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs text-center">
                    {unreadCount}
                  </span>
                                )}
                            </button>

                            {/* Notification dropdown */}
                            {isNotificationsOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                    <div className="py-1">
                                        <div className="px-4 py-2 border-b border-gray-200">
                                            <h3 className="text-base font-medium text-gray-800">Notifications</h3>
                                        </div>
                                        {notifications.length === 0 ? (
                                            <div className="px-4 py-3 text-sm text-gray-600">
                                                No notifications
                                            </div>
                                        ) : (
                                            notifications.slice(0, 5).map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    className={`px-4 py-3 hover:bg-gray-50 ${
                                                        !notification.isRead ? 'bg-blue-50' : ''
                                                    }`}
                                                >
                                                    <p className="text-sm text-gray-700">{notification.message}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(notification.timestamp).toLocaleString()}
                                                    </p>
                                                </div>
                                            ))
                                        )}
                                        <div className="px-4 py-2 border-t border-gray-200">
                                            <Link
                                                to="/notifications"
                                                className="text-sm text-primary-dark hover:underline"
                                                onClick={() => setIsNotificationsOpen(false)}
                                            >
                                                View all notifications
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile dropdown */}
                        <div className="ml-3 relative">
                            <div>
                                <button
                                    type="button"
                                    className="bg-primary-dark flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white"
                                    onClick={toggleProfileMenu}
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center">
                                        {user?.profilePicture ? (
                                            <img
                                                className="h-8 w-8 rounded-full"
                                                src={user.profilePicture}
                                                alt=""
                                            />
                                        ) : (
                                            <span className="text-white font-medium">
                        {user?.firstName?.charAt(0) || ''}
                                                {user?.lastName?.charAt(0) || ''}
                      </span>
                                        )}
                                    </div>
                                </button>
                            </div>

                            {isProfileMenuOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                    <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-200">
                                        <p>Signed in as</p>
                                        <p className="font-medium text-gray-800">{user?.email || ''}</p>
                                    </div>
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setIsProfileMenuOpen(false)}
                                    >
                                        Your Profile
                                    </Link>
                                    <Link
                                        to="/settings"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setIsProfileMenuOpen(false)}
                                    >
                                        Settings
                                    </Link>
                                    <Link
                                        to="/support"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setIsProfileMenuOpen(false)}
                                    >
                                        Support
                                    </Link>
                                    <button
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={handleLogout}
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex items-center md:hidden ml-3">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                onClick={toggleMenu}
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMenuOpen ? (
                                    <svg
                                        className="block h-6 w-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="block h-6 w-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state */}
            <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link
                        to="/dashboard"
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                            location.pathname === '/dashboard' ? 'bg-primary-dark' : 'hover:bg-primary-light'
                        }`}
                    >
                        Dashboard
                    </Link>

                    <Link
                        to="/application"
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                            location.pathname.startsWith('/application') ? 'bg-primary-dark' : 'hover:bg-primary-light'
                        }`}
                    >
                        Apply
                    </Link>

                    <Link
                        to="/profile"
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                            location.pathname === '/profile' ? 'bg-primary-dark' : 'hover:bg-primary-light'
                        }`}
                    >
                        Profile
                    </Link>

                    {user?.role === 'admin' && (
                        <Link
                            to="/admin"
                            className={`block px-3 py-2 rounded-md text-base font-medium ${
                                location.pathname.startsWith('/admin') ? 'bg-primary-dark' : 'hover:bg-primary-light'
                            }`}
                        >
                            Admin
                        </Link>
                    )}

                    <Link
                        to="/help"
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                            location.pathname === '/help' ? 'bg-primary-dark' : 'hover:bg-primary-light'
                        }`}
                    >
                        Help
                    </Link>

                    <Link
                        to="/support"
                        className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-light"
                    >
                        Support
                    </Link>

                    <Link
                        to="/settings"
                        className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-light"
                    >
                        Settings
                    </Link>

                    <button
                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-primary-light"
                        onClick={handleLogout}
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;