import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="shell">
        <p className="eyebrow">Not on this edition</p>
        <h1>That local pick could not be found.</h1>
        <p>
          The page may have moved, or this business may not be part of the
          current Catonsville preview.
        </p>
        <Link className="button button-primary" href="/catonsville">
          Browse Catonsville
        </Link>
      </div>
    </section>
  );
}
