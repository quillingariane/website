import React from 'react';
import { Briefcase, Building, ExternalLink, Plus } from 'lucide-react';
import { prisma } from '@/lib/db';
import { addApplication } from '@/lib/tracker-actions';
import StatusUpdateForm from '@/components/StatusUpdateForm';
import { VALID_APPLICATION_STATUSES } from '@/lib/constants';

export default async function TrackerPage() {
  // Fetch applications (safe fallback when database is disconnected/deprecated)
  let applications: Array<{
    id: string;
    company: string;
    role: string;
    status: string;
    link?: string | null;
  }> = [];

  try {
    applications = await prisma.application.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch {
    // Database is deprecated / offline
    applications = [];
  }

  const statusOptions = VALID_APPLICATION_STATUSES;

  return (
    <div className="max-w-4xl mx-auto py-20 px-4 space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3 website-font">
          <Briefcase className="text-primary" /> Application Tracker
        </h1>
        <p className="text-muted-foreground mt-2">
          Personal job and internship application tracker.
        </p>
      </div>

      {/* ADD APPLICATION FORM */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
        <h2 className="text-lg font-bold mb-4 website-font">Add New Application</h2>
        <form action={addApplication} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text" name="company" placeholder="Company Name" required
            className="bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-primary"
          />
          <input
            type="text" name="role" placeholder="Job Role" required
            className="bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-primary"
          />
          <select
            name="status" required
            className="bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-primary"
          >
            {statusOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <input
            type="url" name="link" placeholder="Posting URL (Optional)"
            className="bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-primary"
          />
          <input
            type="password" name="adminPassword" placeholder="Master Password to Save" required
            className="bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-primary md:col-span-2"
          />
          <button
            type="submit"
            className="md:col-span-2 bg-primary text-primary-foreground font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus size={18} /> Save Application
          </button>
        </form>
      </div>

      {/* LIST OF APPLICATIONS */}
      <div className="grid gap-4">
        {applications.map((app) => (
          <div key={app.id} className="bg-card border border-border p-5 rounded-xl flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h3 className="font-bold text-foreground text-lg flex items-center gap-2 website-font">
                <Building size={16} className="text-muted-foreground" /> {app.company}
              </h3>
              <p className="text-muted-foreground text-sm font-medium">{app.role}</p>
            </div>
            <div className="flex items-center gap-4">
              <StatusUpdateForm
                applicationId={app.id}
                currentStatus={app.status}
                statusOptions={statusOptions}
              />

              {app.link && (
                <a href={app.link} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <ExternalLink size={18} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}