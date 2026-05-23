import { NextResponse, type NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/data/auth";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type CopyPromptRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

const COPY_RATE_LIMIT = {
  limit: 30,
  windowMs: 60 * 1000,
};

export async function POST(
  request: NextRequest,
  { params }: CopyPromptRouteProps
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ counted: false });
  }

  const rateLimit = checkRateLimit({
    identifier: `prompt:copy:${getClientIp(request.headers)}:${user.id}`,
    ...COPY_RATE_LIMIT,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        counted: false,
        error: "Terlalu banyak request. Coba lagi sebentar.",
      },
      {
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
        status: 429,
      }
    );
  }

  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("record_prompt_copy", {
    target_prompt_id: id,
  });

  if (error) {
    return NextResponse.json(
      {
        counted: false,
        error: "Copy count gagal diperbarui.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ counted: Boolean(data) });
}
