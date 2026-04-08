import { NextResponse } from "next/server";

import { exportInquiriesToCsv } from "@/features/inquiries/actions";

export async function GET() {
  const csv = await exportInquiriesToCsv();

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="inquiries.csv"',
    },
  });
}
