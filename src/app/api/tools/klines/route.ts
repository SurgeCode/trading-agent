import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const interval = searchParams.get('interval') || '1h';
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 1000);
    
    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      );
    }

    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    const klines = data.map((kline: any[]) => ({
      openTime: kline[0],
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      volume: parseFloat(kline[5]),
      closeTime: kline[6],
      quoteVolume: parseFloat(kline[7]),
      trades: kline[8],
      takerBuyBaseVolume: parseFloat(kline[9]),
      takerBuyQuoteVolume: parseFloat(kline[10])
    }));

    // Calculate basic technical indicators
    const closes = klines.map(k => k.close);
    const volumes = klines.map(k => k.volume);
    
    const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
    const priceChange = ((closes[closes.length - 1] - closes[0]) / closes[0]) * 100;
    
    return NextResponse.json({
      success: true,
      data: {
        symbol,
        interval,
        klines,
        summary: {
          priceChange: parseFloat(priceChange.toFixed(2)),
          avgVolume: parseFloat(avgVolume.toFixed(2)),
          currentPrice: closes[closes.length - 1],
          high24h: Math.max(...klines.map(k => k.high)),
          low24h: Math.min(...klines.map(k => k.low))
        }
      }
    });
  } catch (error) {
    console.error('Klines error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch klines data' },
      { status: 500 }
    );
  }
} 