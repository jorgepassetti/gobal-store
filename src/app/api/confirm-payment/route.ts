import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { paymentId, orderId, status } = body;

    // Validación básica
    if (!paymentId || !orderId || !status) {
      return NextResponse.json(
        { error: 'Faltan datos obligatorios' },
        { status: 400 },
      );
    }

    // Aquí puedes guardar en Firestore, PostgreSQL, etc.
    console.log('✅ Confirmando pago en sistema:', {
      paymentId,
      orderId,
      status,
    });

    // Ejemplo: guardar en Firestore (ajusta según tu DB)
    // await saveOrderToDatabase({ paymentId, orderId, status });

    return NextResponse.json({
      success: true,
      message: 'Pago confirmado en nuestro sistema',
    });
  } catch (error) {
    console.error('Error al confirmar pago:', error);
    return NextResponse.json(
      { error: 'Error interno al confirmar pago' },
      { status: 500 },
    );
  }
}
