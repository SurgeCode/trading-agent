import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500);
    
    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      );
    }

    const url = `https://api.binance.com/api/v3/aggTrades?symbol=${symbol}&limit=${limit}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    const trades = data.map((trade: any) => ({
      id: trade.a,
      price: parseFloat(trade.p),
      quantity: parseFloat(trade.q),
      firstTradeId: trade.f,
      lastTradeId: trade.l,
      timestamp: trade.T,
      isBuyerMaker: trade.m
    }));

    // Calculate volume analysis
    const buyVolume = trades.filter(t => !t.isBuyerMaker).reduce((sum, t) => sum + (t.price * t.quantity), 0);
    const sellVolume = trades.filter(t => t.isBuyerMaker).reduce((sum, t) => sum + (t.price * t.quantity), 0);
    const totalVolume = buyVolume + sellVolume;
    const buyPressure = totalVolume > 0 ? (buyVolume / totalVolume) * 100 : 50;
    
    const avgPrice = trades.reduce((sum, t) => sum + t.price, 0) / trades.length;
    const priceRange = {
      high: Math.max(...trades.map(t => t.price)),
      low: Math.min(...trades.map(t => t.price))
    };

    return NextResponse.json({
      success: true,
      data: {
        symbol,
        trades: trades.slice(0, 50),
        analysis: {
          buyVolume: parseFloat(buyVolume.toFixed(2)),
          sellVolume: parseFloat(sellVolume.toFixed(2)),
          buyPressure: parseFloat(buyPressure.toFixed(2)),
          avgPrice: parseFloat(avgPrice.toFixed(8)),
          priceRange,
          totalTrades: trades.length
        }
      }
    });
  } catch (error) {
    console.error('Aggregate trades error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch aggregate trades data' },
      { status: 500 }
    );
  }
} 