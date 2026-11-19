/**
 * ============================================================================
 * CLOUDFLARE PAGES FUNCTIONS - API PROXY
 * Lokasi File: functions/api/[[path]].js
 * Fungsi: Menjembatani komunikasi Frontend (/api) ke Google Apps Script Web App
 *         Menangani CORS, HTTP Redirect 302 GAS, dan menyembunyikan GAS_WEB_APP_URL
 * ============================================================================
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Content-Type': 'application/json; charset=utf-8'
};

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}

export async function onRequestGet(context) {
  const gasUrl = context.env.GAS_WEB_APP_URL;
  if (!gasUrl) {
    return new Response(
      JSON.stringify({
        success: false,
        code: 'MISSING_ENV',
        message: 'Environment variable GAS_WEB_APP_URL belum diatur pada pengaturan Cloudflare Pages.'
      }),
      { status: 500, headers: CORS_HEADERS }
    );
  }

  try {
    const gasResponse = await fetch(gasUrl, {
      method: 'GET',
      redirect: 'follow'
    });
    const text = await gasResponse.text();
    return new Response(text, {
      status: 200,
      headers: CORS_HEADERS
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        code: 'PROXY_ERROR',
        message: 'Gagal terhubung ke Google Apps Script: ' + (err.message || 'Unknown error')
      }),
      { status: 502, headers: CORS_HEADERS }
    );
  }
}

export async function onRequestPost(context) {
  const gasUrl = context.env.GAS_WEB_APP_URL;

  if (!gasUrl) {
    return new Response(
      JSON.stringify({
        success: false,
        code: 'MISSING_ENV',
        message: 'Environment variable GAS_WEB_APP_URL belum dikonfigurasi di Cloudflare Pages.'
      }),
      { status: 500, headers: CORS_HEADERS }
    );
  }

  try {
    const bodyText = await context.request.text();

    // Teruskan request POST ke Google Apps Script Web App dan ikuti redirect 302 GAS
    const gasResponse = await fetch(gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: bodyText,
      redirect: 'follow'
    });

    const responseText = await gasResponse.text();

    // Validasi apakah respons GAS berbentuk JSON yang valid
    try {
      JSON.parse(responseText);
    } catch (parseErr) {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'INVALID_GAS_RESPONSE',
          message: 'Google Apps Script mengembalikan halaman HTML alih-alih JSON. Pastikan Deployment Web App diatur ke "Who has access: Anyone" (Siapa saja).'
        }),
        { status: 502, headers: CORS_HEADERS }
      );
    }

    return new Response(responseText, {
      status: 200,
      headers: CORS_HEADERS
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        code: 'PROXY_FETCH_FAILED',
        message: 'Kesalahan koneksi proxy ke Backend: ' + (err.message || 'Network error')
      }),
      { status: 502, headers: CORS_HEADERS }
    );
  }
}