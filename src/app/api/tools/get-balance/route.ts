import { NextResponse } from 'next/server';
import { INTENTS_CONTRACT_ID } from '@/app/config';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const accountId = searchParams.get('accountId');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token parameter is required' },
        { status: 400 }
      );
    }

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID parameter is required' },
        { status: 400 }
      );
    }

    // Use NEAR RPC to call view function
    const rpcUrl = process.env.NEAR_RPC_URL || 'https://rpc.mainnet.near.org';
    
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'dontcare',
        method: 'query',
        params: {
          request_type: 'call_function',
          finality: 'final',
          account_id: INTENTS_CONTRACT_ID,
          method_name: 'mt_balance_of',
          args_base64: Buffer.from(JSON.stringify({
            token_id: token,
            account_id: accountId,
          })).toString('base64'),
        },
      }),
    });

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message || 'RPC error');
    }

    const balance = JSON.parse(Buffer.from(result.result.result, 'base64').toString());

    return NextResponse.json({
      success: true,
      data: {
        balance: balance,
        token: token,
        accountId: accountId
      }
    });
  } catch (error) {
    console.error('Balance error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balance' },
      { status: 500 }
    );
  }
} 