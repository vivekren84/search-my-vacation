import { siteContact } from "@/config/contact.config";

type SiteAddressProps = {
  className?: string;
};

export default function SiteAddress({ className = "" }: SiteAddressProps) {
  return (
    <address className={`not-italic ${className}`.trim()}>
      {siteContact.address.displayLines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </address>
  );
}
