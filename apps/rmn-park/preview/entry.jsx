/**
 * Single-file preview entry — bundles the exact same ParkApp (minus the
 * Next.js shell) into one HTML file for CSP-strict hosts like Artifacts.
 * Production deploys should use the Next app, not this bundle.
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import ParkApp from '@/components/ParkApp';

createRoot(document.getElementById('root')).render(<ParkApp />);
