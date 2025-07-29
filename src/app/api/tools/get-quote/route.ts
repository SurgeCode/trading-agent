import { NextResponse } from 'next/server';
import { OneClickService, Quote, QuoteRequest, QuoteResponse } from '@defuse-protocol/one-click-sdk-typescript';
import { TOKEN_LIST, INTENTS_CONTRACT_ID } from '@/app/config';
import { actionCreators } from '@near-js/transactions';

const TGas = BigInt(10) ** BigInt(12);

function parseAmountWithDecimals(amount: string, assetId: string): string {
  const token = TOKEN_LIST.find(t => t.assetId === assetId);
  if (!token) {
    throw new Error(`Unknown asset: ${assetId}`);
  }
  
  // Convert decimal amount to base units
  const [whole, decimal = ''] = amount.split('.');
  const decimalsToAdd = token.decimals - decimal.length;
  const baseUnits = whole + decimal + '0'.repeat(Math.max(0, decimalsToAdd));
  
  return baseUnits.replace(/^0+/, '') || '0';
}

function buildTransactionPayload(quote: QuoteResponse) {

  return {
    receiverId: INTENTS_CONTRACT_ID,
    actions: [
      actionCreators.functionCall(
        "mt_transfer",
        {
          token_id: quote.quoteRequest.originAsset,
          receiver_id: quote.quote.depositAddress,
          amount: quote.quote.amountIn,
        },
        TGas * BigInt(30),
        BigInt(1)
      ),
    ],
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const originAsset = searchParams.get('originAsset');
    const destinationAsset = searchParams.get('destinationAsset');
    const amount = searchParams.get('amount'); // This should be with decimals (e.g., "0.01" for 0.01 USDC)
    const slippageTolerance = parseInt(searchParams.get('slippageTolerance') || '100');
    const refundTo = searchParams.get('refundTo');
    const recipient = searchParams.get('recipient');

    if (!originAsset || !destinationAsset || !amount) {
      return NextResponse.json(
        { error: 'Missing required parameters: originAsset, destinationAsset, amount' },
        { status: 400 }
      );
    }

    if (!refundTo || !recipient) {
      return NextResponse.json(
        { error: 'Missing required parameters: refundTo, recipient' },
        { status: 400 }
      );
    }

    const amountInBaseUnits = parseAmountWithDecimals(amount, originAsset);

    const quoteRequest: QuoteRequest = {
      dry: false,
      swapType: QuoteRequest.swapType.EXACT_INPUT,
      slippageTolerance,
      depositType: QuoteRequest.depositType.INTENTS,
      originAsset,
      destinationAsset,
      amount: amountInBaseUnits,
      refundTo,
      refundType: QuoteRequest.refundType.INTENTS,
      recipient,
      recipientType: QuoteRequest.recipientType.INTENTS,
      deadline: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    };

    const quoteResponse = await OneClickService.getQuote(quoteRequest);

    const transactionPayload = buildTransactionPayload(quoteResponse);

    return NextResponse.json({
      success: true,
      data: {
        quote: {
          originAsset: quoteResponse.quoteRequest.originAsset,
          destinationAsset: quoteResponse.quoteRequest.destinationAsset,
          amountIn: quoteResponse.quote.amountIn,
          amountInFormatted: quoteResponse.quote.amountInFormatted,
          amountOut: quoteResponse.quote.amountOut,
          amountOutFormatted: quoteResponse.quote.amountOutFormatted,
          minAmountOut: quoteResponse.quote.minAmountOut,
          depositAddress: quoteResponse.quote.depositAddress,
          deadline: quoteResponse.quote.deadline,
          timeEstimate: quoteResponse.quote.timeEstimate,
          signature: quoteResponse.signature,
          timestamp: quoteResponse.timestamp
        },
        transaction: transactionPayload
      }
    });
  } catch (error) {
    console.error('Quote error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch quote' },
      { status: 500 }
    );
  }
} 