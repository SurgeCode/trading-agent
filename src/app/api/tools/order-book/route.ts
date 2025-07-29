import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 1000);
    
    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      );
    }

    const url = `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=${limit}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    const bids = data.bids.slice(0, 20).map(([price, qty]: [string, string]) => ({
      price: parseFloat(price),
      quantity: parseFloat(qty),
      total: parseFloat(price) * parseFloat(qty)
    }));
    
    const asks = data.asks.slice(0, 20).map(([price, qty]: [string, string]) => ({
      price: parseFloat(price),
      quantity: parseFloat(qty),
      total: parseFloat(price) * parseFloat(qty)
    }));
    
    const bidPrice = parseFloat(data.bids[0][0]);
    const askPrice = parseFloat(data.asks[0][0]);
    const spread = askPrice - bidPrice;
    const spreadPercent = (spread / bidPrice) * 100;
    
    return NextResponse.json({
      success: true,
      data: {
        symbol,
        lastUpdateId: data.lastUpdateId,
        bids,
        asks,
        spread: parseFloat(spread.toFixed(8)),
        spreadPercent: parseFloat(spreadPercent.toFixed(4)),
        midPrice: parseFloat(((bidPrice + askPrice) / 2).toFixed(8)),
        bidDepth: bids.reduce((sum, bid) => sum + bid.total, 0),
        askDepth: asks.reduce((sum, ask) => sum + ask.total, 0)
      }
    });
  } catch (error) {
    console.error('Order book error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order book data' },
      { status: 500 }
    );
  }
} 