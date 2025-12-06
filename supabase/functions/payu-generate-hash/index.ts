import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Get PayU credentials from environment variables (set in Supabase Dashboard > Edge Functions > Secrets)
const PAYU_MERCHANT_KEY = Deno.env.get("PAYU_MERCHANT_KEY");
const PAYU_MERCHANT_SALT = Deno.env.get("PAYU_MERCHANT_SALT");

const requiredFields = ["txnid", "amount", "productinfo", "firstname", "email"];

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
    const { paymentData = {} } = await req.json();

    for (const field of requiredFields) {
      if (!paymentData[field]) {
        return new Response(JSON.stringify({ error: `Missing field: ${field}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    if (!PAYU_MERCHANT_KEY || !PAYU_MERCHANT_SALT) {
      return new Response(JSON.stringify({
        error: "PayU credentials are not configured. Set PAYU_MERCHANT_KEY and PAYU_MERCHANT_SALT secrets.",
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PayU hash generation formula:
    // sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt)
    const amount = Number(paymentData.amount).toFixed(2);
    const hashString = [
      PAYU_MERCHANT_KEY,
      paymentData.txnid,
      amount,
      paymentData.productinfo,
      paymentData.firstname,
      paymentData.email,
      paymentData.udf1 || "",
      paymentData.udf2 || "",
      paymentData.udf3 || "",
      paymentData.udf4 || "",
      paymentData.udf5 || "",
      "",
      "",
      "",
      "",
      "",
      PAYU_MERCHANT_SALT,
    ].join("|");

    const hash = await sha512(hashString);

    // Return hash and key directly (not nested in data object)
    // The SDK will wrap this in { data: ... }
    return new Response(JSON.stringify({ hash, key: PAYU_MERCHANT_KEY }), {
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
