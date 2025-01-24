import React from 'react';
import { type PortalConfig } from '../../../portals/types';

interface PortalLayoutProps {
  config: PortalConfig;
  children: React.ReactNode;
}

export function PortalLayout({ config, children }: PortalLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{config.description}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Feature Navigation */}
        <nav className="mb-8">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {config.features.map((feature) => (
              <li key={feature.id}>
                <a
                  href={feature.path}
                  className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 text-blue-600">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Page Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {children}
        </div>
      </main>
    </div>
  );
} 