// TODO: add contactEmail when the project inbox is configured.

export const ADVERTISER_PHONE_DISPLAY = "(443) 702-5366";
export const ADVERTISER_PHONE_LINK = "+14437025366";

export function AdvertiserContact() {
  return (
    <div className="advertiser-contact">
      <p className="eyebrow">Talk directly</p>
      <p>
        Local business owners can call or text to ask about Catonsville
        placement availability, pricing, and timing for the first edition.
      </p>
      <div className="advertiser-contact-actions">
        <a className="button button-primary" href={`tel:${ADVERTISER_PHONE_LINK}`}>
          Call {ADVERTISER_PHONE_DISPLAY}
        </a>
        <a className="button button-secondary" href={`sms:${ADVERTISER_PHONE_LINK}`}>
          Text {ADVERTISER_PHONE_DISPLAY}
        </a>
      </div>
    </div>
  );
}
