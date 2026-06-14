"use client";

import { FormEvent, useState } from "react";

type NewsletterFormProps = {
  compact?: boolean;
};

export function NewsletterForm({ compact = false }: NewsletterFormProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="form-success" role="status">
        <strong>You are on the preview list.</strong>
        <span>We will send the next round of Catonsville picks your way.</span>
      </div>
    );
  }

  return (
    <form
      className={`newsletter-form${compact ? " newsletter-form-compact" : ""}`}
      onSubmit={handleSubmit}
    >
      <label className="sr-only" htmlFor={compact ? "footer-email" : "email"}>
        Email address
      </label>
      <input
        id={compact ? "footer-email" : "email"}
        type="email"
        name="email"
        placeholder="you@example.com"
        autoComplete="email"
        required
      />
      <button type="submit">Send me the picks</button>
    </form>
  );
}
