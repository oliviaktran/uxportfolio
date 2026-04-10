import { ContactForm } from "@/components/ContactForm";
import { PixelEnvelope } from "@/components/PixelEnvelope";

export const metadata = {
  title: "Contact - Olivia Tran",
};

export default function ContactPage() {
  return (
    <main
      className="relative mx-auto max-w-[1200px] px-5 py-14 md:px-8 md:py-20"
      style={{ color: "var(--color-primary)" }}
    >
      <div
        className="pointer-events-none absolute bottom-24 right-0 top-32 select-none overflow-hidden text-right md:right-8"
        aria-hidden
      >
        <p className="font-sans text-[clamp(3rem,12vw,8rem)] font-black leading-[0.85] text-[rgba(26,53,197,0.07)]">
          INSTAGRAM
        </p>
        <p className="font-sans text-[clamp(3rem,12vw,8rem)] font-black leading-[0.85] text-[rgba(26,53,197,0.08)]">
          LINKEDIN
        </p>
        <p className="font-sans text-[clamp(3rem,12vw,8rem)] font-black leading-[0.85] text-[rgba(26,53,197,0.07)]">
          TWITTER
        </p>
      </div>

      <div className="relative z-10 max-w-xl">
        <div className="mb-6 flex justify-start">
          <PixelEnvelope />
        </div>
        <h1 className="font-serif-display text-5xl font-semibold italic leading-tight md:text-6xl">
          Say hello
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">
          Hiring, collaboration, or questions about case studies - send a note.
        </p>

        <div className="mt-12">
          <ContactForm />
        </div>
      </div>

      <footer className="relative z-10 mt-24 flex flex-col gap-4 border-t border-[var(--color-grid-strong)] pt-8 text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)] md:flex-row md:justify-between">
        <div>
          <p>Direct mail: hello@oliviakttran.com</p>
          <p>Seattle, WA</p>
        </div>
        <div className="md:text-right">
          <p>© 2026 Olivia Tran</p>
          <p>Portfolio</p>
        </div>
      </footer>
    </main>
  );
}
