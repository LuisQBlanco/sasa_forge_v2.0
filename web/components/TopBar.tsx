import Container from "@/components/Container";

export default function TopBar() {
  return (
    <div className="bg-blue-700 text-blue-50">
      <Container className="flex flex-col gap-2 py-2 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm">
        <div className="flex flex-wrap items-center gap-4">
          <span>sasaamazingsolutions@gmail.com</span>
          <span>+1 (416) 822-5245</span>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <span className="opacity-80">Toronto / GTA</span>
          <span className="h-1 w-1 rounded-full bg-blue-200" />
          <span className="opacity-80">Canada-wide shipping</span>
        </div>
      </Container>
    </div>
  );
}
