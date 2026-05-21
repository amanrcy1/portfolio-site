import ContactForm from '@/components/contact/ContactForm';
import ResumeDownload from '@/components/contact/ResumeDownload';
import { ScrollReveal } from '@/components/animations';

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <ScrollReveal variant="fade" threshold={0.2}>
        <h1 className="text-3xl font-heading font-bold text-brand-text sm:text-4xl">
          Contact
        </h1>
        <p className="mt-4 text-lg text-brand-text/70">
          Get in touch to discuss quality engineering, collaboration opportunities, or just to say hello.
        </p>
      </ScrollReveal>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <ScrollReveal variant="slide-left" threshold={0.2}>
          <div>
            <h2 className="text-xl font-heading font-semibold text-brand-text">
              Send a Message
            </h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="slide-right" threshold={0.2}>
          <div>
            <h2 className="text-xl font-heading font-semibold text-brand-text">
              Resume
            </h2>
            <p className="mt-4 text-brand-text/70">
              Download my resume to learn more about my experience and qualifications.
            </p>
            <div className="mt-6">
              <ResumeDownload />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
