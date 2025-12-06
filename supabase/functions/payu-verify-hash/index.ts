import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Get PayU credentials from environment variables (set in Supabase Dashboard > Edge Functions > Secrets)
const PAYU_MERCHANT_KEY = Deno.env.get("PAYU_MERCHANT_KEY");
const PAYU_MERCHANT_SALT = Deno.env.get("PAYU_MERCHANT_SALT");

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function sha512(input: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-512", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Only POST is allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { params = {} } = await req.json();

    if (!params.hash || !params.status || !params.txnid || !params.amount) {
      return new Response(JSON.stringify({ error: "Missing required PayU response fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!PAYU_MERCHANT_KEY || !PAYU_MERCHANT_SALT) {
      return new Response(JSON.stringify({
        error: "PayU credentials are not configured. Set PAYU_MERCHANT_KEY and PAYU_MERCHANT_SALT secrets.",
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PayU reverse hash verification formula:
    // sha512(salt|status|udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
    const amount = Number(params.amount).toFixed(2);
    const hashString = [
      PAYU_MERCHANT_SALT,
      params.status,
      params.udf5 || "",
      params.udf4 || "",
      params.udf3 || "",
      params.udf2 || "",
      params.udf1 || "",
      params.email || "",
      params.firstname || "",
      params.productinfo || "",
      amount,
      params.txnid,
      PAYU_MERCHANT_KEY,
    ].join("|");

    const expectedHash = await sha512(hashString);
    const isValid = expectedHash === params.hash;

    // Return directly (not nested in data object)
    // The SDK will wrap this in { data: ... }
    return new Response(JSON.stringify({
      isValid,
      expectedHash,
      receivedHash: params.hash,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
