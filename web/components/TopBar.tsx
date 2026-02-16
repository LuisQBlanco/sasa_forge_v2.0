import Container from "@/components/Container";
import { siteContent } from "@/content/siteContent";

export default function TopBar() {
  return (
    <div className="bg-blue-700 text-blue-50">
      <Container className="flex flex-col gap-2 py-2 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm">
        <div className="flex flex-wrap items-center gap-4">
          <span>{siteContent.global.topBarLeft}</span>
          <span className="hidden h-1 w-1 rounded-full bg-blue-200 sm:block" />
          <span>{siteContent.global.topBarRight}</span>
        </div>
        <div className="flex items-center gap-3">
          <a href={`mailto:${siteContent.global.email}`} className="opacity-90 hover:opacity-100">
            {siteContent.global.email}
          </a>
          <span className="h-1 w-1 rounded-full bg-blue-200" />
          <a href="tel:+14168225245" className="opacity-90 hover:opacity-100">
            {siteContent.global.phone}
          </a>
          <span className="h-1 w-1 rounded-full bg-blue-200" />
          <a href={siteContent.global.whatsapp} className="opacity-90 hover:opacity-100">
            WhatsApp
          </a>
        </div>
      </Container>
    </div>
  );
}
