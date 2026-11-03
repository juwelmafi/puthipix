import { notFound } from "next/navigation";
import { MOCK_BOOKS } from "@/data/mockBooks";
import { ReaderView } from "@/components/reader/ReaderView";

interface Props {
  params: Promise<{ bookId: string }>;
}

export function generateStaticParams() {
  return MOCK_BOOKS.map((b) => ({
    bookId: b.id,
  }));
}

export default async function ReaderPage({ params }: Props) {
  const { bookId } = await params;
  const book = MOCK_BOOKS.find((b) => b.id === bookId);

  if (!book) {
    notFound();
  }

  return <ReaderView book={book} />;
}
