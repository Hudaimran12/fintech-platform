import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="empty-state" style={{ marginTop: '5rem' }}>
          <div className="empty-icon" style={{ fontSize: '4rem' }}>404</div>
          <h3>Page Not Found</h3>
          <p>The page you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
