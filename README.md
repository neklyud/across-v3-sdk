# Across V3 SDK

A lightweight SDK for interacting with the Across V3 API.

## Installation

```bash
npm install across-v3-sdk
```

## Usage

```typescript
import { createAcrossClient } from 'across-v3-sdk';

const client = createAcrossClient();

// Get suggested fees
const fees = await client.getSuggestedFees({
  originChainId: '1',
  destinationChainId: '2',
  inputToken: '0x123...',
  outputToken: '0x456...',
  amount: '1000000',
});

// Get limits
const limits = await client.getLimits({
  originChainId: '1',
  destinationChainId: '2',
  inputToken: '0x123...',
  outputToken: '0x456...',
});

// Get available routes
const routes = await client.getAvailableRoutes({
  originChainId: '1',
  destinationChainId: '2',
});

// Get deposit status
const status = await client.getDepositStatus({
  originChainId: '1',
  depositId: '123',
});
```

## API Reference

### `createAcrossClient()`

Creates a new instance of the Across client.

### `getSuggestedFees(params: AcrossSuggestedFeesParams)`

Get suggested fees for a bridge transaction.

### `getLimits(params: AcrossLimitsParams)`

Get deposit limits for a token pair.

### `getAvailableRoutes(params?: AcrossAvailableRoutesParams)`

Get available bridge routes.

### `getDepositStatus(params: AcrossDepositStatusParams)`

Get the status of a deposit.

## License

ISC
