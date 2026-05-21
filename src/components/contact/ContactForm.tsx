'use client';

import { useState, FormEvent } from 'react';
import { ContactFormData } from '@/types/contact';

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

function validateForm(data: ContactFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required';
  } else if (data.name.length > 100) {
    errors.name = 'Name must be 100 characters or fewer';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (data.email.length > 254) {
    errors.email = 'Email must be 254 characters or fewer';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.message.trim()) {
    errors.message = 'Message is required';
  } else if (data.message.length > 2000) {
    errors.message = 'Message must be 2000 characters or fewer';
  }

  return errors;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitError('Something went wrong. Please try again.');
      }
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="rounded-lg border border-brand-accent/30 bg-brand-accent/10 p-6 text-center">
        <h3 className="text-xl font-heading font-semibold text-brand-accent">
          Message Sent!
        </h3>
        <p className="mt-2 text-brand-text/80">
          Thank you for reaching out. I&apos;ll get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => setIsSuccess(false)}
          className="mt-4 rounded-md bg-brand-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-accent/80"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-brand-text">
          Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          maxLength={100}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border border-brand-text/20 bg-brand-surface px-4 py-2 text-brand-text placeholder-brand-text/40 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
          placeholder="Your name"
          aria-describedby={errors.name ? 'name-error' : undefined}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-400" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-brand-text">
          Email <span className="text-red-400">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          maxLength={254}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border border-brand-text/20 bg-brand-surface px-4 py-2 text-brand-text placeholder-brand-text/40 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
          placeholder="you@example.com"
          aria-describedby={errors.email ? 'email-error' : undefined}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-400" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-brand-text">
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          maxLength={2000}
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="mt-1 block w-full rounded-md border border-brand-text/20 bg-brand-surface px-4 py-2 text-brand-text placeholder-brand-text/40 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
          placeholder="Your message..."
          aria-describedby={errors.message ? 'message-error' : undefined}
          aria-invalid={!!errors.message}
        />
        <p className="mt-1 text-xs text-brand-text/50">
          {formData.message.length}/2000 characters
        </p>
        {errors.message && (
          <p id="message-error" className="mt-1 text-sm text-red-400" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      {submitError && (
        <p className="text-sm text-red-400" role="alert">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-brand-primary px-6 py-3 font-medium text-white transition-colors hover:bg-brand-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
