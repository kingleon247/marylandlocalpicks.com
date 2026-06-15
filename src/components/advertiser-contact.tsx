// TODO: add contactEmail when the project inbox is configured.

export const ADVERTISER_PHONE_VANITY = "443-94-PICKS";
export const ADVERTISER_PHONE_NUMERIC = "(443) 947-4257";
export const ADVERTISER_PHONE_LINK = "+14439474257";

export function AdvertiserContact() {
  return (
    <div className="advertiser-contact">
      <p className="eyebrow">Talk directly</p>
      <p>
        Local business owners can call or text{" "}
        <strong>{ADVERTISER_PHONE_VANITY}</strong> to ask about category
        availability, pricing, and timing for the next 10,000-home mailing.
      </p>
      <p className="contact-number-numeric">{ADVERTISER_PHONE_NUMERIC}</p>
      <div className="advertiser-contact-actions">
        <a className="button button-primary" href={`tel:${ADVERTISER_PHONE_LINK}`}>
          Call {ADVERTISER_PHONE_VANITY}
        </a>
        <a className="button button-secondary" href={`sms:${ADVERTISER_PHONE_LINK}`}>
          Text {ADVERTISER_PHONE_VANITY}
        </a>
      </div>
    </div>
  );
}
