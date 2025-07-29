import { ACCOUNT_ID, PLUGIN_URL } from '@/app/config';
import { NextResponse } from 'next/server';

export async function GET() {
  const pluginData = {
    openapi: '3.0.0',
    info: {
      title: 'Crypto Trading Agent',
      description: 'Market data analysis and trading decision tools',
      version: '1.0.0',
    },
    servers: [
      {
        url: PLUGIN_URL,
      },
    ],
    'x-mb': {
      'account-id': ACCOUNT_ID,
      assistant: {
        name: 'Crypto Trading Agent',
        description:
          "A sophisticated trading agent that analyzes cryptocurrency market data to make informed trading decisions across multiple tokens.",
        instructions:
          "You are an autonomous crypto trading agent. Use these 5 essential tools for comprehensive market analysis: 1) market-overview for 24hr price movements and volume across multiple tokens, 2) klines for technical analysis with support for multiple timeframes (1h for short-term, 1d for trends, 1w/1M for long-term), 3) fear-greed for market sentiment timing (low values = buying opportunities, high values = caution), 4) order-book for liquidity and spread analysis before trades, 5) aggregate-trades for buy/sell pressure analysis. Make data-driven decisions combining technical patterns, market sentiment, volume analysis, and liquidity assessment. Portfolio data will be injected into your context.",
        tools: [
        ],
      },
    },
    paths: {
      '/api/tools/get-blockchains': {
        get: {
          summary: 'get blockchain information',
          description: 'Respond with a list of blockchains',
          operationId: 'get-blockchains',
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        description: 'The list of blockchains',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/tools/get-user': {
        get: {
          summary: 'get user information',
          description: 'Returns user account ID and EVM address',
          operationId: 'get-user',
          parameters: [
            {
              name: 'accountId',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
              },
              description: "The user's account ID",
            },
            {
              name: 'evmAddress',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
              },
              description: "The user's EVM address",
            },
          ],
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      accountId: {
                        type: 'string',
                        description:
                          "The user's account ID, if you dont have it, return an empty string",
                      },
                      evmAddress: {
                        type: 'string',
                        description:
                          "The user's EVM address, if you dont have it, return an empty string",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/tools/twitter': {
        get: {
          operationId: 'getTwitterShareIntent',
          summary: 'Generate a Twitter share intent URL',
          description:
            'Creates a Twitter share intent URL based on provided parameters',
          parameters: [
            {
              name: 'text',
              in: 'query',
              required: true,
              schema: {
                type: 'string',
              },
              description: 'The text content of the tweet',
            },
            {
              name: 'url',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
              },
              description: 'The URL to be shared in the tweet',
            },
            {
              name: 'hashtags',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
              },
              description: 'Comma-separated hashtags for the tweet',
            },
            {
              name: 'via',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
              },
              description: 'The Twitter username to attribute the tweet to',
            },
          ],
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      twitterIntentUrl: {
                        type: 'string',
                        description: 'The generated Twitter share intent URL',
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        description: 'Error message',
                      },
                    },
                  },
                },
              },
            },
            '500': {
              description: 'Error response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        description: 'Error message',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/tools/create-near-transaction': {
        get: {
          operationId: 'createNearTransaction',
          summary: 'Create a NEAR transaction payload',
          description:
            'Generates a NEAR transaction payload for transferring tokens to be used directly in the generate-tx tool',
          parameters: [
            {
              name: 'receiverId',
              in: 'query',
              required: true,
              schema: {
                type: 'string',
              },
              description: 'The NEAR account ID of the receiver',
            },
            {
              name: 'amount',
              in: 'query',
              required: true,
              schema: {
                type: 'string',
              },
              description: 'The amount of NEAR tokens to transfer',
            },
          ],
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      transactionPayload: {
                        type: 'object',
                        properties: {
                          receiverId: {
                            type: 'string',
                            description: "The receiver's NEAR account ID",
                          },
                          actions: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                type: {
                                  type: 'string',
                                  description:
                                    "The type of action (e.g., 'Transfer')",
                                },
                                params: {
                                  type: 'object',
                                  properties: {
                                    deposit: {
                                      type: 'string',
                                      description:
                                        'The amount to transfer in yoctoNEAR',
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        description: 'Error message',
                      },
                    },
                  },
                },
              },
            },
            '500': {
              description: 'Error response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        description: 'Error message',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/tools/create-evm-transaction': {
        get: {
          operationId: 'createEvmTransaction',
          summary: 'Create EVM transaction',
          description:
            'Generate an EVM transaction payload with specified recipient and amount to be used directly in the generate-evm-tx tool',
          parameters: [
            {
              name: 'to',
              in: 'query',
              required: true,
              schema: {
                type: 'string',
              },
              description: 'The EVM address of the recipient',
            },
            {
              name: 'amount',
              in: 'query',
              required: true,
              schema: {
                type: 'string',
              },
              description: 'The amount of ETH to transfer',
            },
          ],
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      evmSignRequest: {
                        type: 'object',
                        properties: {
                          to: {
                            type: 'string',
                            description: 'Receiver address',
                          },
                          value: {
                            type: 'string',
                            description: 'Transaction value',
                          },
                          data: {
                            type: 'string',
                            description: 'Transaction data',
                          },
                          from: {
                            type: 'string',
                            description: 'Sender address',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        description: 'Error message',
                      },
                    },
                  },
                },
              },
            },
            '500': {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        description: 'Error message',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/tools/market-overview': {
        get: {
          summary: 'Get 24hr market overview',
          description: 'Get 24hr price change statistics for multiple symbols',
          operationId: 'marketOverview',
          parameters: [
            {
              name: 'symbols',
              in: 'query',
              required: true,
              schema: { type: 'string' },
              description: 'Comma-separated trading symbols (e.g., BTCUSDT,ETHUSDT,BNBUSDT)',
            },
          ],
          responses: {
            '200': {
              description: 'Market data retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            symbol: { type: 'string' },
                            price: { type: 'number' },
                            priceChange: { type: 'number' },
                            priceChangePercent: { type: 'number' },
                            volume: { type: 'number' },
                            high: { type: 'number' },
                            low: { type: 'number' },
                            trades: { type: 'number' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Bad request - invalid symbols parameter',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            }
          },
        },
      },
      '/api/tools/klines': {
        get: {
          summary: 'Get candlestick data with technical analysis',
          description: 'Get kline/candlestick data for technical analysis with long-term support (up to 1000 candles)',
          operationId: 'klines',
          parameters: [
            {
              name: 'symbol',
              in: 'query',
              required: true,
              schema: { type: 'string' },
              description: 'Trading symbol (e.g., BTCUSDT)',
            },
            {
              name: 'interval',
              in: 'query',
              required: false,
              schema: { type: 'string', default: '1h' },
              description: 'Time interval: 1m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M',
            },
            {
              name: 'limit',
              in: 'query',
              required: false,
              schema: { type: 'integer', default: 100 },
              description: 'Number of candles (max: 1000)',
            },
          ],
          responses: {
            '200': {
              description: 'Candlestick data with analysis retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          symbol: { type: 'string' },
                          interval: { type: 'string' },
                          klines: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                openTime: { type: 'number' },
                                open: { type: 'number' },
                                high: { type: 'number' },
                                low: { type: 'number' },
                                close: { type: 'number' },
                                volume: { type: 'number' },
                                closeTime: { type: 'number' },
                                quoteVolume: { type: 'number' },
                                trades: { type: 'number' },
                                takerBuyBaseVolume: { type: 'number' },
                                takerBuyQuoteVolume: { type: 'number' }
                              }
                            }
                          },
                          summary: {
                            type: 'object',
                            properties: {
                              priceChange: { type: 'number' },
                              avgVolume: { type: 'number' },
                              currentPrice: { type: 'number' },
                              high24h: { type: 'number' },
                              low24h: { type: 'number' },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Bad request - invalid symbol parameter',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            }
          },
        },
      },
      '/api/tools/fear-greed': {
        get: {
          summary: 'Get Fear and Greed Index',
          description: 'Get current crypto market sentiment via Fear and Greed Index with trading interpretation',
          operationId: 'fearGreed',
          responses: {
            '200': {
              description: 'Fear and Greed data retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          value: { type: 'number' },
                          classification: { type: 'string' },
                          updateTime: { type: 'string' },
                          interpretation: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
            '500': {
              description: 'Internal server error - CMC API failure',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            }
          },
        },
      },
      '/api/tools/order-book': {
        get: {
          summary: 'Get order book depth',
          description: 'Get order book data for liquidity and spread analysis',
          operationId: 'orderBook',
          parameters: [
            {
              name: 'symbol',
              in: 'query',
              required: true,
              schema: { type: 'string' },
              description: 'Trading symbol (e.g., BTCUSDT)',
            },
            {
              name: 'limit',
              in: 'query',
              required: false,
              schema: { type: 'integer', default: 100 },
              description: 'Number of entries (max: 1000)',
            },
          ],
          responses: {
            '200': {
              description: 'Order book data retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          symbol: { type: 'string' },
                          bids: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                price: { type: 'number' },
                                quantity: { type: 'number' },
                                total: { type: 'number' }
                              }
                            }
                          },
                          asks: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                price: { type: 'number' },
                                quantity: { type: 'number' },
                                total: { type: 'number' }
                              }
                            }
                          },
                          spread: { type: 'number' },
                          spreadPercent: { type: 'number' },
                          midPrice: { type: 'number' },
                          bidDepth: { type: 'number' },
                          askDepth: { type: 'number' },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Bad request - invalid symbol parameter',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            }
          },
        },
      },
      '/api/tools/aggregate-trades': {
        get: {
          summary: 'Get aggregate trades with volume analysis',
          description: 'Get compressed aggregate trades with buy/sell pressure analysis',
          operationId: 'aggregateTrades',
          parameters: [
            {
              name: 'symbol',
              in: 'query',
              required: true,
              schema: { type: 'string' },
              description: 'Trading symbol (e.g., BTCUSDT)',
            },
            {
              name: 'limit',
              in: 'query',
              required: false,
              schema: { type: 'integer', default: 100 },
              description: 'Number of trades (max: 500)',
            },
          ],
          responses: {
            '200': {
              description: 'Aggregate trades data retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          symbol: { type: 'string' },
                          trades: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                id: { type: 'number' },
                                price: { type: 'number' },
                                quantity: { type: 'number' },
                                firstTradeId: { type: 'number' },
                                lastTradeId: { type: 'number' },
                                timestamp: { type: 'number' },
                                isBuyerMaker: { type: 'boolean' }
                              }
                            }
                          },
                          analysis: {
                            type: 'object',
                            properties: {
                              buyVolume: { type: 'number' },
                              sellVolume: { type: 'number' },
                              buyPressure: { type: 'number' },
                              avgPrice: { type: 'number' },
                              priceRange: {
                                type: 'object',
                                properties: {
                                  high: { type: 'number' },
                                  low: { type: 'number' }
                                }
                              },
                              totalTrades: { type: 'number' },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Bad request - invalid symbol parameter',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            }
          },
        },
      },
      '/api/tools/get-balance': {
        get: {
          summary: 'Get account balance',
          description: 'Get multi-token balance for an account',
          operationId: 'getBalance',
          parameters: [
            {
              name: 'token',
              in: 'query',
              required: true,
              schema: { type: 'string' },
              description: 'Token ID for multi-token balance (e.g., nep141:wrap.near)',
            },
            {
              name: 'accountId',
              in: 'query',
              required: true,
              schema: { type: 'string' },
              description: 'NEAR account ID to check balance for',
            }
          ],
          responses: {
            '200': {
              description: 'Balance retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          balance: { type: 'string' },
                          token: { type: 'string' },
                          accountId: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Bad request - missing required parameters',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/tools/get-quote': {
        get: {
          summary: 'Get swap quote',
          description: 'Get a quote for swapping between tokens using OneClick. Amount should be provided with decimals (e.g., "0.01" for 0.01 USDC)',
          operationId: 'getQuote',
          parameters: [
            {
              name: 'originAsset',
              in: 'query',
              required: true,
              schema: { type: 'string' },
              description: 'Origin asset identifier (e.g., nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near)',
            },
            {
              name: 'destinationAsset',
              in: 'query',
              required: true,
              schema: { type: 'string' },
              description: 'Destination asset identifier',
            },
            {
              name: 'amount',
              in: 'query',
              required: true,
              schema: { type: 'string' },
              description: 'Amount to swap WITH DECIMALS (e.g., "0.01" for 0.01 USDC, "1.5" for 1.5 ETH)',
            },
            {
              name: 'slippageTolerance',
              in: 'query',
              required: false,
              schema: { type: 'integer', default: 100 },
              description: 'Slippage tolerance in basis points (default: 100 = 1%)',
            },
            {
              name: 'refundTo',
              in: 'query',
              required: true,
              schema: { type: 'string' },
              description: 'NEAR account ID for refunds',
            },
            {
              name: 'recipient',
              in: 'query',
              required: true,
              schema: { type: 'string' },
              description: 'NEAR account ID to receive swapped tokens',
            }
          ],
          responses: {
            '200': {
              description: 'Quote retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          quote: {
                            type: 'object',
                            properties: {
                              originAsset: { type: 'string' },
                              destinationAsset: { type: 'string' },
                              amountIn: { type: 'string', description: 'Input amount in base units' },
                              amountInFormatted: { type: 'string', description: 'Human-readable input amount' },
                              amountOut: { type: 'string', description: 'Output amount in base units' },
                              amountOutFormatted: { type: 'string', description: 'Human-readable output amount' },
                              minAmountOut: { type: 'string', description: 'Minimum output with slippage' },
                              depositAddress: { type: 'string', description: 'NEAR account to deposit to' },
                              deadline: { type: 'string', description: 'ISO timestamp when quote expires' },
                              timeEstimate: { type: 'number', description: 'Estimated swap time in seconds' },
                              signature: { type: 'string', description: 'Quote signature for verification' },
                              timestamp: { type: 'string', description: 'Quote creation timestamp' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Bad request - invalid parameters',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
  };

  return NextResponse.json(pluginData);
}
