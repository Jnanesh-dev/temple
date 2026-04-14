'use server'

import { resend } from '@/lib/resend';

const RECIPIENT = process.env.OFFICIAL_RECIPIENT_EMAIL || 'shreedurgaadishakthi@gmail.com';

export async function sendContactEmail(formData: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  type: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Temple Website <onboarding@resend.dev>',
      to: [RECIPIENT],
      subject: `New Contact Enquiry: ${formData.subject}`,
      reply_to: formData.email,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #8B0000; border-bottom: 2px solid #8B0000; padding-bottom: 10px;">New Contact Form Submission</h2>
          <p><strong>Type:</strong> ${formData.type}</p>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone}</p>
          <p><strong>Subject:</strong> ${formData.subject}</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${formData.message}</p>
          </div>
          <p style="font-size: 12px; color: #666; margin-top: 30px; text-align: center;">Sent from Shree Durga Adishakti Temple Website</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Email action error:', err);
    return { success: false, error: err.message };
  }
}

export async function sendAdmissionsEmail(formData: {
  studentName: string;
  parentName: string;
  email: string;
  phone: string;
  class: string;
  message?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'School Admissions <onboarding@resend.dev>',
      to: [RECIPIENT],
      subject: `New Admission Enquiry: ${formData.studentName} (${formData.class})`,
      reply_to: formData.email,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #8B0000; border-bottom: 2px solid #8B0000; padding-bottom: 10px;">New School Admission Enquiry</h2>
          <p><strong>Student Name:</strong> ${formData.studentName}</p>
          <p><strong>Parent/Guardian Name:</strong> ${formData.parentName}</p>
          <p><strong>Grade/Class Interested In:</strong> ${formData.class}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone}</p>
          ${formData.message ? `
          <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
            <p><strong>Additional Message:</strong></p>
            <p style="white-space: pre-wrap;">${formData.message}</p>
          </div>
          ` : ''}
          <p style="font-size: 12px; color: #666; margin-top: 30px; text-align: center;">Sent from Prajna International School Website</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Email action error:', err);
    return { success: false, error: err.message };
  }
}

export async function sendDonationNotification(formData: {
  name: string;
  email: string;
  phone: string;
  address?: string;
  amount: number;
  purpose: string;
  frequency: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Temple Donations <onboarding@resend.dev>',
      to: [RECIPIENT],
      subject: `New Donation Intent: ₹${formData.amount}`,
      reply_to: formData.email,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #8B0000; border-bottom: 2px solid #8B0000; padding-bottom: 10px;">New Donation Notification</h2>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone}</p>
          <p><strong>Amount:</strong> ₹${formData.amount}</p>
          <p><strong>Purpose:</strong> ${formData.purpose}</p>
          <p><strong>Frequency:</strong> ${formData.frequency}</p>
          ${formData.address ? `<p><strong>Address:</strong> ${formData.address}</p>` : ''}
          <p style="font-size: 12px; color: #666; margin-top: 30px; text-align: center;">Sent from Shree Durga Adishakti Temple Website</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Email action error:', err);
    return { success: false, error: err.message };
  }
}
