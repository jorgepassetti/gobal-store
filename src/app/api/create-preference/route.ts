// app/api/create-preference/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { PreferenceCreateData } from 'mercadopago/dist/clients/preference/create/types';
// Agrega credenciales

// Configura tu token de acceso
const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;

if (!MP_ACCESS_TOKEN) {
  throw new Error(
    'MERCADOPAGO_ACCESS_TOKEN no está definido en las variables de entorno',
  );
}

const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
const preference = new Preference(client);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.back_urls?.success) {
      return NextResponse.json(
        { error: 'back_urls.success es obligatorio' },
        { status: 400 },
      );
    }

    if (
      !body.auto_return ||
      !['approved', 'disapproved'].includes(body.auto_return)
    ) {
      return NextResponse.json(
        { error: 'auto_return debe ser "approved" o "disapproved"' },
        { status: 400 },
      );
    }

    console.log('Creating preference with body:', body);

    const pref: PreferenceCreateData = {
      body: {
        items: body.items,
        payer: body.payer,
        back_urls: body.back_urls,
        auto_return: body.auto_return,
        payment_methods: body.payment_methods,
        metadata: body.metadata,
        external_reference: body.metadata.orderId, // Útil para vincular con tu sistema
      },
    };

    const response = await preference.create(pref);

    return NextResponse.json({ id: response.id });
  } catch (error: any) {
    console.error('Error creating preference:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno' },
      { status: 500 },
    );
  }
}
