import { useState } from 'react';
import { sendContactMessage } from '../services/contactService.js';

const MESSAGES = {
  loading: 'Sending message...',
  success: 'Message sent successfully! I will get back to you soon.',
  server: 'Oops! Something went wrong with the server.',
  network: 'Network error. Please try again or use the links below.',
};

/** Controller for the contact form: owns submission status and talks to the contact service. */
export function useContactForm() {
  const [formStatus, setFormStatus] = useState({ status: 'idle', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    setFormStatus({ status: 'loading', message: MESSAGES.loading });

    const data = Object.fromEntries(new FormData(form).entries());
    const result = await sendContactMessage(data);

    if (result.ok) {
      setFormStatus({ status: 'success', message: MESSAGES.success });
      form.reset();
    } else {
      setFormStatus({ status: 'error', message: MESSAGES[result.reason] });
    }
  };

  return { formStatus, handleSubmit };
}
