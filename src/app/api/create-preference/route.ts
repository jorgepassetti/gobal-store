// app/api/create-preference/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Sipago credentials (move to .env for production)
const SIPAGO_BASE_URL = 'https://auth.preprod.geopagos.com';
const SIPAGO_API_URL = 'https://api-cabal.preprod.geopagos.com'; // Assuming this is the base for /api/v2/orders

const CLIENT_ID =
  process.env.SIPAGO_CLIENT_ID || '3c21db0f-6913-43db-88d6-2ced87b99a91';
const CLIENT_SECRET =
  process.env.SIPAGO_CLIENT_SECRET || 'ft6z30q2ftsmu90au0mp';

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error(
    'SIPAGO_CLIENT_ID and SIPAGO_CLIENT_SECRET must be defined in environment variables',
  );
}

// Step 1: Get Access Token from Sipago OAuth
async function getSipagoAccessToken() {
  try {
    const response = await fetch(`${SIPAGO_BASE_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: '*',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to get access token: ${response.status} ${errorText}`,
      );
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error fetching Sipago access token:', error);
    throw error;
  }
}

// Step 2: Create Checkout Order
async function createCheckoutOrder(accessToken: string, orderData: any) {
  try {
    const response = await fetch(`${SIPAGO_API_URL}/api/v2/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to create order: ${response.status} ${errorText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating Sipago order:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields (minimal — you can extend as needed)
    if (!body?.data?.attributes?.redirect_urls?.success) {
      return NextResponse.json(
        { error: 'redirect_urls.success is required' },
        { status: 400 },
      );
    }

    if (!body?.data?.attributes?.currency) {
      return NextResponse.json(
        { error: 'currency is required' },
        { status: 400 },
      );
    }

    if (
      !Array.isArray(body?.data?.attributes?.items) ||
      body.data.attributes.items.length === 0
    ) {
      return NextResponse.json(
        { error: 'At least one item is required' },
        { status: 400 },
      );
    }

    console.log(
      'Creating Sipago order with body:',
      JSON.stringify(body, null, 2),
    );

    // Step 1: Get access token
    const accessToken = await getSipagoAccessToken();

    // Step 2: Create order
    const orderResponse = await createCheckoutOrder(accessToken, body);
    console.log('Order response from Sipago:', JSON.stringify(orderResponse));

    // Return the Sipago order ID or relevant data
    return NextResponse.json({
      id: orderResponse.data?.id,
      checkout_url: orderResponse?.data?.attributes?.links?.checkout, // if provided by Sipago
    });
  } catch (error: any) {
    console.error('Error in Sipago order creation:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 },
    );
  }
}
