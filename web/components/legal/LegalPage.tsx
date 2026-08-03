import { readFile } from "node:fs/promises";
import path from "node:path";

import WhatsAppLink from "@/components/contact/WhatsAppLink";
import PublicPage from "@/components/layout/PublicPage";
import { siteBrand } from "@/config/brand.config";
import { siteContact } from "@/config/contact.config";

function LegalContact() {
  return (
  <div className="mt-5 rounded-2xl border border-[#e1ceb0] bg-white p-6 text-[#705c47]">
    <p className="font-semibold text-[#2d2117]">
      {siteBrand.name}
    </p>

    <div className="mt-5 flex flex-col items-start gap-3">
      <a
        className="underline underline-offset-4"
        href={siteContact.emailHref}
      >
        {siteContact.email}
      </a>

      <a
        className="underline underline-offset-4"
        href={siteContact.primaryPhoneHref}
      >
        {siteContact.phoneDisplay}
      </a>

      <WhatsAppLink compact />
    </div>

    <p className="mt-5 leading-7">
      Service hours: {siteContact.officeHours}
    </p>

    <p className="leading-7">
      Typical response time: Within four business hours
    </p>
  </div>
  );
}

function renderBlock(block: string, index: number) {
  if (block.trim() === "{{SMV_PUBLIC_CONTACT}}") {
    return <LegalContact key={index} />;
  }

  if (block.startsWith("# ")) return null;

  if (block.startsWith("## ")) {
    return (
      <h2 key={index} className="mt-10 text-2xl font-semibold">
        {block.replace(/^## \d*\.?\s?/, "")}
      </h2>
    );
  }

  if (block.startsWith("|")) {
    const rows = block
      .split("\n")
      .filter((line) => !/^\|[-\s|]+\|$/.test(line))
      .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));

    return (
      <div key={index} className="mt-5 overflow-x-auto rounded-xl border border-[#e1ceb0] bg-white">
        <table className="w-full table-fixed text-left text-sm">
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex === 0 ? "bg-[#f6ead8] font-semibold" : "border-t border-[#eadfce]"}>
                {row.map((cell, cellIndex) =>
                  rowIndex === 0 ? (
                    <th key={cellIndex} className="break-words px-4 py-3">{cell}</th>
                  ) : (
                    <td key={cellIndex} className="break-words px-4 py-3 text-[#705c47]">{cell}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (block.startsWith("- ")) {
    return (
      <ul key={index} className="mt-5 list-disc space-y-2 pl-6 leading-7 text-[#705c47]">
        {block.split("\n").map((line) => <li key={line}>{line.slice(2)}</li>)}
      </ul>
    );
  }

  const emailRegex =
  /\[([^\]]+)\]\((mailto:[^)]+)\)/;

if (emailRegex.test(block)) {
  const match = block.match(emailRegex)!;

  return (
    <p key={index} className="mt-5 leading-8 text-[#705c47]">
      {block.split(match[0])[0]}
      <a
        href={match[2]}
        className="underline underline-offset-4"
      >
        {match[1]}
      </a>
      {block.split(match[0])[1]}
    </p>
  );
  }

  return (
    <p key={index} className="mt-5 leading-8 text-[#705c47]">
      {block.replace(/\*\*/g, "")}
    </p>
  );
}

export default async function LegalPage({ file, title }: { file: string; title: string }) {
  const source = await readFile(path.join(process.cwd(), "..", "docs", "14-Legal", file), "utf8");
  const blocks = source
    .split("\n\n")
    .filter(
      (block) =>
        !block.includes("Table of Contents") &&
        !/^\d+\. \[/.test(block) &&
        !block.startsWith("| Document field | Value |"),
    );

  return (
    <PublicPage
      eyebrow="Legal"
      title={title}
      intro="Please read this information carefully. For questions about these terms or your information, contact Search My Vacation."
    >
      <article className="layout-container layout-container--reading layout-section min-w-0 text-[1.025rem]">
        {blocks.map(renderBlock)}
      </article>
    </PublicPage>
  );
}
