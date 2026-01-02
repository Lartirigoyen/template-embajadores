import { NextResponse } from 'next/server';
import { checkDatabaseConnection, primaryPool, secondaryPool } from '~/server/db';

export async function GET() {
  try {
    const primaryStatus = await checkDatabaseConnection(primaryPool);
    const secondaryStatus = secondaryPool
      ? await checkDatabaseConnection(secondaryPool)
      : null;

    const isHealthy = primaryStatus && (secondaryStatus === null || secondaryStatus);

    return NextResponse.json(
      {
        status: isHealthy ? 'ok' : 'degraded',
        timestamp: new Date().toISOString(),
        database: {
          primary: primaryStatus ? 'connected' : 'disconnected',
          secondary: secondaryStatus !== null
            ? (secondaryStatus ? 'connected' : 'disconnected')
            : 'not_configured',
        },
      },
      { status: isHealthy ? 200 : 503 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
