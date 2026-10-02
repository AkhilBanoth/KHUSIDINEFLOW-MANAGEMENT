import React, { useEffect, useRef, useState } from 'react';
import { useAuth, PRESET_ACCOUNTS, ROLE_PERMISSIONS } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ALL_NAV_ITEMS } from './Sidebar';
import { 
  Search, Sun, Moon, Shield, ChevronDown, Check, Menu, X
} from 'lucide-react';

export default function Header({ currentView, theme, onToggleTheme, onNavigate, onMenuToggle, isMobileNavOpen }) {
  const { user, role, switchRole, backendStatus, checkHealth, permissions } = useAuth();
  const { showToast } = useToast();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const headerRef = useRef(null);
  const searchInputRef = useRef(null);
  const availableViews = ALL_NAV_ITEMS.filter((item) => permissions?.allowedViews?.includes(item.id));
  const matchingViews = availableViews.filter((item) =>
    `${item.label} ${item.id}`.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setSearchOpen(false);
        setRoleDropdownOpen(false);
      }
    };
    const handleShortcut = (event) => {
      const isTyping = event.target instanceof HTMLElement &&
        (event.target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName));
      if (!isTyping && (event.key === '/' || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k'))) {
        event.preventDefault();
        searchInputRef.current?.focus();
        setSearchOpen(true);
      }
    };
    document.addEventListener('pointerdown', handleOutsideClick);
    window.addEventListener('keydown', handleShortcut);
    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
      window.removeEventListener('keydown', handleShortcut);
    };
  }, []);

  const handleRoleSelect = async (targetRole) => {
    setRoleDropdownOpen(false);
    setSwitching(true);
    try {
      await switchRole(targetRole);
      const targetPerms = ROLE_PERMISSIONS[targetRole] || ROLE_PERMISSIONS.ADMIN;
      if (onNavigate) {
        onNavigate(targetPerms.defaultView);
      }
      showToast(`Switched station to ${targetRole}: ${targetPerms.stationName}`, 'success');
    } catch {
      showToast(`Failed to switch to ${targetRole}`, 'error');
    } finally {
      setSwitching(false);
    }
  };

  return (
    <header
      ref={headerRef}
      className="app-header"
      style={{
        height: 'var(--header-height)',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(9, 13, 22, 0.85)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        gap: '20px',
      }}
    >
      <button
        type="button"
        className="mobile-menu-toggle btn btn-secondary btn-sm"
        onClick={onMenuToggle}
        aria-label={`${isMobileNavOpen ? 'Close' : 'Open'} navigation menu`}
        aria-controls="primary-navigation"
        aria-expanded={isMobileNavOpen}
      >
        {isMobileNavOpen ? <X size={19} /> : <Menu size={19} />}
      </button>

      {/* Quick section search */}
      <div className="header-search">
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
          }}
        />
        <input
          ref={searchInputRef}
          data-global-search
          type="text"
          placeholder="Find a section..."
          value={searchQuery}
          onFocus={() => setSearchOpen(true)}
          onChange={(event) => {
            setSearchQuery(event.target.value);
            setSearchOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setSearchOpen(false);
            if (event.key === 'Enter' && matchingViews[0]) {
              onNavigate(matchingViews[0].id);
              setSearchQuery('');
              setSearchOpen(false);
            }
          }}
          aria-label={`Find a section. Current section: ${currentView}`}
          aria-expanded={searchOpen}
          aria-controls="section-search-results"
          className="input"
          style={{
            paddingLeft: '36px',
            paddingRight: '36px',
            height: '40px',
            fontSize: '0.85rem',
            borderRadius: 'var(--radius-full)',
          }}
        />
        <kbd
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '0.65rem',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '2px 6px',
            borderRadius: '4px',
            color: 'var(--text-muted)',
          }}
        >
          / or Ctrl K
        </kbd>
        {searchOpen && (
          <div className="search-results" id="section-search-results" role="listbox" aria-label="Navigation results">
            <div className="search-results-heading">{searchQuery ? 'Matching sections' : 'Go to a section'}</div>
            {matchingViews.length ? matchingViews.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={currentView === item.id}
                  className="search-result"
                  onClick={() => {
                    onNavigate(item.id);
                    setSearchQuery('');
                    setSearchOpen(false);
                  }}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                  {currentView === item.id && <Check size={15} aria-label="Current section" />}
                </button>
              );
            }) : (
              <div className="search-empty">No matching sections</div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="header-controls" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Backend & DB Health Indicator */}
        <button
          type="button"
          className="health-status"
          onClick={checkHealth}
          aria-label={backendStatus.online ? 'Backend connected. Check connection again' : 'Backend offline. Retry connection'}
          title="Click to re-ping MongoDB backend"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease',
          }}
        >
          <span className={`pulse-dot ${backendStatus.online ? 'online' : 'offline'}`} />
          <span style={{ color: backendStatus.online ? 'var(--text-primary)' : 'var(--danger)', fontWeight: 600 }}>
            {backendStatus.online ? `MongoDB Live` : 'DB Offline'}
          </span>
          {backendStatus.latency && (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
              ({backendStatus.latency}ms)
            </span>
          )}
        </button>

        {/* 1-Click Role Switcher */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            aria-expanded={roleDropdownOpen}
            aria-haspopup="menu"
            aria-label={`Current station ${role}. Switch station`}
            className="btn btn-secondary btn-sm"
            data-station-switcher
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Shield size={14} style={{ color: 'var(--primary)' }} />
            <span className="station-label" style={{ fontWeight: 600 }}>{role}</span>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </button>

          {roleDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '240px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                padding: '8px',
                zIndex: 200,
                backdropFilter: 'blur(16px)',
              }}
            >
              <div style={{ padding: '6px 10px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                1-CLICK STATION SWITCHER
              </div>
              {PRESET_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  role="menuitem"
                  onClick={() => handleRoleSelect(acc.role)}
                  disabled={switching}
                  className="role-option"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    background: role === acc.role ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    color: role === acc.role ? 'var(--primary)' : 'var(--text-primary)',
                    fontSize: '0.825rem',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      role === acc.role ? 'rgba(99, 102, 241, 0.15)' : 'transparent')
                  }
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{acc.title}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{acc.email}</div>
                  </div>
                  {role === acc.role && <Check size={14} style={{ color: 'var(--primary)' }} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          className="btn btn-secondary btn-sm"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%' }}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* User Pill */}
        <div
          className="user-pill"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.8rem',
              color: '#fff',
            }}
          >
            {user?.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          <div className="user-details" style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user?.name || 'Administrator'}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
