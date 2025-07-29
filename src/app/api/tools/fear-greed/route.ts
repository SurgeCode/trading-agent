import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://pro-api.coinmarketcap.com/v3/fear-and-greed/latest', {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY || '',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`CMC API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: {
        value: data.data.value,
        classification: data.data.value_classification,
        updateTime: data.data.update_time,
        interpretation: data.data.value >= 75 ? 'Extreme Greed - Consider selling' :
                      data.data.value >= 55 ? 'Greed - Be cautious' :
                      data.data.value >= 45 ? 'Neutral' :
                      data.data.value >= 25 ? 'Fear - Good buying opportunity' :
                      'Extreme Fear - Excellent buying opportunity'
      }
    });
  } catch (error) {
    console.error('Fear and Greed error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Fear and Greed data' },
      { status: 500 }
    );
  }
} 