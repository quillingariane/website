'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { VALID_APPLICATION_STATUSES } from '@/lib/constants';

// Helper for password verification
function verifyAdminPassword(password: FormDataEntryValue | null) {
  if (typeof password !== 'string' || password.trim() === '') {
    console.error('Unauthorized: Admin password is required.');
    throw new Error('Unauthorized action: Admin password is required.');
  }
  if (password !== process.env.TRACKER_ADMIN_PASSWORD) { // Ensure comparison is against string
    console.error('Unauthorized: Incorrect password');
    // For security, throw an error that can be caught and handled gracefully
    throw new Error('Unauthorized action: Incorrect password.');
  }
}

export async function addApplication(formData: FormData) {
  try {
    // 1. Verify the password before doing anything
    const password = formData.get('adminPassword');
    verifyAdminPassword(password);

    // 2. Extract and manually validate data
    const company = formData.get('company');
    const role = formData.get('role');
    const status = formData.get('status');
    const link = formData.get('link');

    if (typeof company !== 'string' || company.trim() === '') {
      throw new Error('Company name is required.');
    }
    if (typeof role !== 'string' || role.trim() === '') {
      throw new Error('Role is required.');
    }
    if (typeof status !== 'string' || !(VALID_APPLICATION_STATUSES as readonly string[]).includes(status)) {
      throw new Error('Invalid status provided.');
    }
    // Link is optional, if provided and not empty, use it, otherwise null.
    const finalLink = (typeof link === 'string' && link.trim() !== '') ? link.trim() : null;

    // 3. Insert into Prisma (if database is available)
    try {
      await prisma.application.create({
        data: { 
          company: company.trim(), 
          role: role.trim(), 
          status: status as 'To Apply' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected', // Cast after validation
          link: finalLink,
        }
      });
    } catch (dbErr) {
      console.warn('Database is deprecated or unreachable. Operation skipped:', dbErr);
    }

    // 4. Revalidate the page to show the new data instantly
    revalidatePath('/pages/portfolio/tracker');
  } catch (error) {
    console.error('Error adding application:', error);
    // Re-throw or return a specific error message to the client if needed
    throw error; // Let Next.js handle the error boundary or client-side catch
  }
}
 
type ApplicationStatus = typeof VALID_APPLICATION_STATUSES[number];

export async function updateApplicationStatus(formData: FormData) {
  try {
    // 1. Verify the password
    const password = formData.get('adminPassword');
    verifyAdminPassword(password);

    // 2. Extract and manually validate data
    const id = formData.get('id');
    const status = formData.get('status');

    if (typeof id !== 'string' || id.trim() === '') {
      throw new Error('Application ID is required.');
    }
    if (typeof status !== 'string' || !(VALID_APPLICATION_STATUSES as readonly string[]).includes(status)) {
      throw new Error('Invalid status provided.');
    }
    // 3. Update in Prisma (if database is available)
    try {
      await prisma.application.update({
        where: { id: id.trim() },
        data: { status: status as ApplicationStatus }, // Cast after validation
      });
    } catch (dbErr) {
      console.warn('Database is deprecated or unreachable. Operation skipped:', dbErr);
    }

    // 4. Revalidate the page
    revalidatePath('/pages/portfolio/tracker');
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
}