import { siteContact } from "@/config/contact.config";
import { FacebookIcon, InstagramIcon, YouTubeIcon } from "@/components/icons/SocialIcons";

type SocialLinksProps = {
  className?: string;
};

/**
 * Release 1.1 — Footer Social Icons Finalisation.
 *
 * Icon-only links to SMV's official social profiles, sourced from the single
 * canonical `siteContact.socialLinks` config entry (never hardcode these
 * URLs elsewhere). Footer-only for this release — do not reuse on the
 * Contact page (explicit business decision for Release 1.1).
 *
 * Sized as 44px (`size-11`) circular tap targets, matching the existing
 * `min-h-11` convention already used by the Footer's phone/email links, and
 * styled as a subtle bordered ghost button so three icons read as a light
 * "Connect" accent rather than competing with the SMV logo, tagline, or
 * WhatsApp/phone/email contact details above them.
 */
export default function SocialLinks({ className = "" }: SocialLinksProps) {
  const platforms = [
    { name: "Instagram", href: siteContact.socialLinks.instagram, Icon: InstagramIcon },
    { name: "Facebook", href: siteContact.socialLinks.facebook, Icon: FacebookIcon },
    { name: "YouTube", href: siteContact.socialLinks.youtube, Icon: YouTubeIcon },
  ] as const;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {platforms.map(({ name, href, Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open Search My Vacation's ${name} in a new tab`}
          className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 text-white/75 transition hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5951C]"
        >
          <Icon className="size-5" />
        </a>
      ))}
    </div>
  );
}
