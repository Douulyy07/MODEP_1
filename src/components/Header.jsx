import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Header({ darkMode, setDarkMode, onToggleSidebar, sidebarCollapsed }) {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-bottom sticky-top">
      <div className="container-fluid">
        <div className="row align-items-center py-3">
          <div className="col-auto">
            <button 
              className="btn btn-link text-dark p-2 d-md-none"
              onClick={onToggleSidebar}
            >
              <i className="bi bi-list fs-4"></i>
            </button>
            <button 
              className="btn btn-link text-dark p-2 d-none d-md-block"
              onClick={onToggleSidebar}
            >
              <i className={`bi ${sidebarCollapsed ? 'bi-layout-sidebar' : 'bi-layout-sidebar-reverse'} fs-5`}></i>
            </button>
          </div>
          
          <div className="col">
            <div className="d-flex align-items-center">
              <div>
                <h4 className="mb-0 fw-bold text-dark">Gestion Mutualiste</h4>
                <small className="text-muted">Tableau de bord administratif</small>
              </div>
            </div>
          </div>

          <div className="col-auto">
            <div className="d-flex align-items-center gap-3">
              {/* Notifications */}
              <div className="position-relative">
                <button className="btn btn-light rounded-circle p-2">
                  <i className="bi bi-bell fs-5"></i>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                    3
                  </span>
                </button>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="btn btn-light rounded-circle p-2"
              >
                <i className={`bi ${darkMode ? 'bi-sun' : 'bi-moon'} fs-5`}></i>
              </button>

              {/* User Avatar */}
              <div className="dropdown">
                <button 
                  className="btn p-0 dropdown-toggle-no-caret"
                  data-bs-toggle="dropdown"
                >
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
                    }}
                  >
                    <span className="text-white fw-medium">
                      {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </span>
                  </div>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><h6 className="dropdown-header">{user?.first_name} {user?.last_name}</h6></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#"><i className="bi bi-person me-2"></i>Profil</a></li>
                  <li><a className="dropdown-item" href="#"><i className="bi bi-gear me-2"></i>Paramètres</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}