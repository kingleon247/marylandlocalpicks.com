"use client";

import { FormEvent, useState } from "react";

export function InquiryForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="form-success form-success-light" role="status">
        <strong>Thanks for your interest.</strong>
        <span>
          We will follow up about category availability and next steps for the
          next 10,000-home mailing.
        </span>
      </div>
    );
  }

  return (
    <form className="inquiry-form" onSubmit={handleSubmit}>
      <div className="field-row">
        <label>
          Your name
          <input
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            required
          />
        </label>
        <label>
          Business name
          <input name="business" type="text" placeholder="Business name" required />
        </label>
      </div>
      <div className="field-row">
        <label>
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email address"
            required
          />
        </label>
        <label>
          Phone
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Phone number"
          />
        </label>
      </div>
      <label>
        What would you like to promote?
        <textarea
          name="message"
          rows={5}
          placeholder="Tell us about your business, offer, or ideal campaign."
          required
        />
      </label>
      <button className="button button-primary button-wide" type="submit">
        Request advertiser details
      </button>
    </form>
  );
}
