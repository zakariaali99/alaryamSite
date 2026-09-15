import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Copy, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Layout } from '../components/Layout';
import { Container } from '../components/Container';
import { PageHero } from '../components/PageHero';
import { SeoHead } from '../components/SeoHead';
import { PeakLines } from '../components/PeakLines';
import { useLang, useT } from '../i18n/context';
import { servicesData } from '../data/services';

interface FormState {
  name: string;
  email: string;
  organization: string;
  service: string;
  message: string;
  website: string; // Honeypot
  ts: number;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export const ContactPage: React.FC = () => {
  const { lang } = useLang();
  const t = useT();
  const [searchParams] = useSearchParams();

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    organization: '',
    service: '',
    message: '',
    website: '',
    ts: Date.now(),
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [shakingField, setShakingField] = useState<string | null>(null);

  // Initialize service from URL query param if present
  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam && servicesData.some((s) => s.slug === serviceParam)) {
      setFormState((prev) => ({ ...prev, service: serviceParam }));
    }
    // Set render timestamp
    setFormState((prev) => ({ ...prev, ts: Date.now() }));
  }, [searchParams]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('Info@Alaryam.ly');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const validateField = (name: string, value: string): string | undefined => {
    if (name === 'name') {
      if (!value.trim()) return t('form.required');
    }
    if (name === 'email') {
      if (!value.trim()) return t('form.required');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim())) return t('form.invalidEmail');
    }
    if (name === 'message') {
      if (!value.trim()) return t('form.required');
      if (value.trim().length < 10) return t('form.messageMinLength');
    }
    return undefined;
  };

  const handleBlur = (field: keyof FormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, String(formState[field]));
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const triggerShake = (fieldName: string) => {
    setShakingField(fieldName);
    setTimeout(() => {
      setShakingField(null);
    }, 350);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const newErrors: FormErrors = {};
    const nameErr = validateField('name', formState.name);
    if (nameErr) newErrors.name = nameErr;

    const emailErr = validateField('email', formState.email);
    if (emailErr) newErrors.email = emailErr;

    const msgErr = validateField('message', formState.message);
    if (msgErr) newErrors.message = msgErr;

    setTouched({
      name: true,
      email: true,
      message: true,
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Shake the first invalid field
      const firstInvalid = Object.keys(newErrors)[0];
      triggerShake(firstInvalid);
      return;
    }

    setIsSubmitting(true);

    if ((import.meta as any).env?.DEV) {
      // Dev mode: simulate network delay and success per §3.5
      console.log('DEV contact form submitted payload:', {
        ...formState,
        lang,
      });
      await new Promise((resolve) => setTimeout(resolve, 900));
      setIsSubmitting(false);
      setIsSuccess(true);
      return;
    }

    try {
      const response = await fetch('/api/contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formState,
          lang,
        }),
      });

      const data = await response.json();
      if (response.ok && data.ok) {
        setIsSuccess(true);
      } else {
        setSubmitError(t('form.error'));
      }
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitError(t('form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    setSubmitError(null);
    setFormState({
      name: '',
      email: '',
      organization: '',
      service: '',
      message: '',
      website: '',
      ts: Date.now(),
    });
    setErrors({});
    setTouched({});
  };

  return (
    <Layout>
      <SeoHead
        path="/contact/"
        title={t('seo.contact.title')}
        description={t('seo.contact.description')}
      />

      <PageHero
        title={t('contact.pageTitle')}
        lead={t('contact.lead')}
        breadcrumbCurrent={t('nav.contact')}
      />

      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Start column: Email card with copy button & quiet PeakLines */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div className="card-standard p-8 lg:p-10 border border-line flex flex-col items-start bg-surface">
                <div className="w-14 h-14 rounded-icon bg-brand-50 flex items-center justify-center mb-6 text-brand-600">
                  <Mail size={28} strokeWidth={1.75} />
                </div>

                <div className="text-[14px] font-bold text-muted uppercase tracking-wider mb-2">
                  {t('contact.emailLabel')}
                </div>

                <a
                  href="mailto:Info@Alaryam.ly"
                  className="text-h3 font-bold text-ink hover:text-brand-600 transition-colors break-all mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/40 rounded-sm"
                >
                  Info@Alaryam.ly
                </a>

                {/* Copy Email Button */}
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-button text-[14px] font-bold bg-white text-ink border border-line shadow-xs hover:border-brand-600 hover:text-brand-600 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/40"
                  aria-label="Copy email address"
                >
                  {copied ? (
                    <>
                      <Check size={16} className="text-brand-600" />
                      <span className="text-brand-600">{t('contact.copied')}</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>{t('contact.copied') ? 'نسخ البريد' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quiet PeakLines below email card */}
              <div className="hidden lg:flex items-center justify-start opacity-70 p-4" aria-hidden="true">
                <PeakLines token="brand-100" width={280} height={180} lines={4} />
              </div>
            </div>

            {/* End column: Form card */}
            <div className="lg:col-span-7">
              <div className="card-standard p-8 lg:p-10 border border-line bg-white shadow-card relative">
                {isSuccess ? (
                  /* Success Panel */
                  <div className="text-center py-12 flex flex-col items-center animate-fadeIn">
                    <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-6 border border-brand-100">
                      <svg
                        className="w-8 h-8 text-brand-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3 className="text-h3 text-ink mb-3">{t('company.name')}</h3>
                    <p className="text-lead text-muted max-w-[440px] mb-8">
                      {t('form.success')}
                    </p>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="text-brand-600 font-bold hover:text-brand-700 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/40 rounded-sm"
                    >
                      {t('form.sendAnother')}
                    </button>
                  </div>
                ) : (
                  /* Form */
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    {/* Error Banner */}
                    {submitError && (
                      <div
                        className="p-4 rounded-card bg-surface border border-line text-ink flex items-start gap-3"
                        role="alert"
                      >
                        <AlertCircle size={20} className="text-brand-600 flex-shrink-0 mt-0.5" />
                        <p className="text-body-sm font-medium">{submitError}</p>
                      </div>
                    )}

                    {/* Honeypot hidden field */}
                    <div
                      style={{
                        opacity: 0,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: 0,
                        width: 0,
                        zIndex: -1,
                        overflow: 'hidden',
                      }}
                      aria-hidden="true"
                    >
                      <label htmlFor="website">Website</label>
                      <input
                        type="text"
                        id="website"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={formState.website}
                        onChange={(e) =>
                          setFormState((prev) => ({ ...prev, website: e.target.value }))
                        }
                      />
                    </div>

                    {/* Name Field (Floating Label) */}
                    <div
                      className={`relative ${
                        shakingField === 'name' ? 'animate-shake' : ''
                      }`}
                    >
                      <input
                        type="text"
                        id="form-name"
                        name="name"
                        maxLength={100}
                        required
                        value={formState.name}
                        onChange={(e) => {
                          setFormState((prev) => ({ ...prev, name: e.target.value }));
                          if (touched.name) {
                            setErrors((prev) => ({
                              ...prev,
                              name: validateField('name', e.target.value),
                            }));
                          }
                        }}
                        onBlur={() => handleBlur('name')}
                        placeholder=" "
                        className={`peer w-full h-14 px-4 pt-4 pb-1 text-ink bg-surface border rounded-card transition-colors focus:outline-none focus:bg-white ${
                          errors.name && touched.name
                            ? 'border-brand-600 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20'
                            : 'border-line focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20'
                        }`}
                      />
                      <label
                        htmlFor="form-name"
                        className="absolute start-4 top-2 text-[12px] font-semibold text-muted transition-all pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-[12px] peer-focus:font-semibold peer-focus:text-brand-600"
                      >
                        {t('form.name')} *
                      </label>
                      {errors.name && touched.name && (
                        <p className="mt-1 text-[13px] font-medium text-brand-600">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email Field (Floating Label) */}
                    <div
                      className={`relative ${
                        shakingField === 'email' ? 'animate-shake' : ''
                      }`}
                    >
                      <input
                        type="email"
                        id="form-email"
                        name="email"
                        maxLength={254}
                        required
                        value={formState.email}
                        onChange={(e) => {
                          setFormState((prev) => ({ ...prev, email: e.target.value }));
                          if (touched.email) {
                            setErrors((prev) => ({
                              ...prev,
                              email: validateField('email', e.target.value),
                            }));
                          }
                        }}
                        onBlur={() => handleBlur('email')}
                        placeholder=" "
                        className={`peer w-full h-14 px-4 pt-4 pb-1 text-ink bg-surface border rounded-card transition-colors focus:outline-none focus:bg-white ${
                          errors.email && touched.email
                            ? 'border-brand-600 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20'
                            : 'border-line focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20'
                        }`}
                      />
                      <label
                        htmlFor="form-email"
                        className="absolute start-4 top-2 text-[12px] font-semibold text-muted transition-all pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-[12px] peer-focus:font-semibold peer-focus:text-brand-600"
                      >
                        {t('form.email')} *
                      </label>
                      {errors.email && touched.email && (
                        <p className="mt-1 text-[13px] font-medium text-brand-600">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Organization Field (Optional) */}
                    <div className="relative">
                      <input
                        type="text"
                        id="form-organization"
                        name="organization"
                        maxLength={150}
                        value={formState.organization}
                        onChange={(e) =>
                          setFormState((prev) => ({ ...prev, organization: e.target.value }))
                        }
                        placeholder=" "
                        className="peer w-full h-14 px-4 pt-4 pb-1 text-ink bg-surface border border-line rounded-card transition-colors focus:outline-none focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
                      />
                      <label
                        htmlFor="form-organization"
                        className="absolute start-4 top-2 text-[12px] font-semibold text-muted transition-all pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-[12px] peer-focus:font-semibold peer-focus:text-brand-600"
                      >
                        {t('form.organization')}
                      </label>
                    </div>

                    {/* Service Select Field */}
                    <div className="relative">
                      <select
                        id="form-service"
                        name="service"
                        value={formState.service}
                        onChange={(e) =>
                          setFormState((prev) => ({ ...prev, service: e.target.value }))
                        }
                        className="w-full h-14 px-4 pt-4 pb-1 text-ink bg-surface border border-line rounded-card transition-colors focus:outline-none focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 appearance-none"
                      >
                        <option value="">{t('form.service')}</option>
                        {servicesData.map((s) => (
                          <option key={s.slug} value={s.slug}>
                            {t(`services.${s.slug}.title`)}
                          </option>
                        ))}
                        <option value="other">{t('form.serviceOther')}</option>
                      </select>
                      <label
                        htmlFor="form-service"
                        className="absolute start-4 top-1.5 text-[11px] font-semibold text-muted pointer-events-none"
                      >
                        {t('form.service')}
                      </label>
                    </div>

                    {/* Message Field (Floating Label) */}
                    <div
                      className={`relative ${
                        shakingField === 'message' ? 'animate-shake' : ''
                      }`}
                    >
                      <textarea
                        id="form-message"
                        name="message"
                        rows={4}
                        maxLength={5000}
                        required
                        value={formState.message}
                        onChange={(e) => {
                          setFormState((prev) => ({ ...prev, message: e.target.value }));
                          if (touched.message) {
                            setErrors((prev) => ({
                              ...prev,
                              message: validateField('message', e.target.value),
                            }));
                          }
                        }}
                        onBlur={() => handleBlur('message')}
                        placeholder=" "
                        className={`peer w-full min-h-[130px] px-4 pt-6 pb-2 text-ink bg-surface border rounded-card transition-colors focus:outline-none focus:bg-white resize-y ${
                          errors.message && touched.message
                            ? 'border-brand-600 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20'
                            : 'border-line focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20'
                        }`}
                      />
                      <label
                        htmlFor="form-message"
                        className="absolute start-4 top-2 text-[12px] font-semibold text-muted transition-all pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-[12px] peer-focus:font-semibold peer-focus:text-brand-600"
                      >
                        {t('form.message')} *
                      </label>
                      {errors.message && touched.message && (
                        <p className="mt-1 text-[13px] font-medium text-brand-600">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 rounded-button bg-brand-600 text-white font-bold text-[16px] flex items-center justify-center gap-2 shadow-sm hover:bg-brand-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-600/40"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>{t('form.sending')}</span>
                          </>
                        ) : (
                          <span>{t('form.submit')}</span>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};
