import { get } from './http';

const ACROSS_API = 'https://app.across.to/api';

export interface AcrossSuggestedFeesParams {
  originChainId: string;
  destinationChainId: string;
  inputToken: string;
  outputToken: string;
  amount: string;
  recipient?: string;
  message?: string;
  relayer?: string;
  timestamp?: string;
}

export interface AcrossSuggestedFeesResult {
  exclusiveRelayer: string;
  exclusivityDeadline: number;
  totalRelayerFee: string;
  minDeposit: string;
  maxDeposit: string;
  fillDeadline: string;
}

export interface AcrossLimitsParams {
  inputToken: string;
  outputToken: string;
  originChainId: string;
  destinationChainId: string;
}

export interface AcrossLimitsResult {
  minDeposit: string;
  maxDeposit: string;
}

export interface AcrossAvailableRoutesParams {
  originChainId?: string;
  destinationChainId?: string;
  originToken?: string;
  destinationToken?: string;
}

export interface AcrossRouteResult {
  originChainId: number;
  originToken: string;
  destinationChainId: number;
  destinationToken: string;
  originTokenSymbol: string;
  destinationTokenSymbol: string;
  isNative: boolean;
}

export interface AcrossDepositStatusParams {
  originChainId: string;
  depositId: string;
}

export interface AcrossDepositStatusResult {
  status: string;
  originChainId: number;
  depositId: string;
  depositTxHash: string;
  fillTx: string | null;
  destinationChainId: number;
  depositRefundTxHash: string | null;
}

export class AcrossClient {
  async getSuggestedFees(
    params: AcrossSuggestedFeesParams,
  ): Promise<AcrossSuggestedFeesResult> {
    const queryParams = new URLSearchParams({
      originChainId: params.originChainId,
      destinationChainId: params.destinationChainId,
      inputToken: params.inputToken,
      outputToken: params.outputToken,
      amount: params.amount,
    });
    if (params.recipient) queryParams.append('recipient', params.recipient);
    if (params.message) queryParams.append('message', params.message);
    if (params.relayer) queryParams.append('relayer', params.relayer);
    if (params.timestamp) queryParams.append('timestamp', params.timestamp);
    const url = `${ACROSS_API}/suggested-fees?${queryParams.toString()}`;
    const response = await get(url);
    return {
      exclusiveRelayer: response.exclusiveRelayer,
      exclusivityDeadline: response.exclusivityDeadline,
      totalRelayerFee: response.totalRelayFee.total,
      minDeposit: response.limits.minDeposit,
      maxDeposit: response.limits.maxDeposit,
      fillDeadline: response.fillDeadline,
    };
  }

  async getLimits(params: AcrossLimitsParams): Promise<AcrossLimitsResult> {
    const queryParams = new URLSearchParams({
      originChainId: params.originChainId,
      destinationChainId: params.destinationChainId,
      inputToken: params.inputToken,
      outputToken: params.outputToken,
    });
    const url = `${ACROSS_API}/limits?${queryParams.toString()}`;
    const response = await get(url);
    return {
      minDeposit: response.minDeposit,
      maxDeposit: response.maxDeposit,
    };
  }

  async getAvailableRoutes(
    params?: AcrossAvailableRoutesParams,
  ): Promise<AcrossRouteResult[]> {
    const queryParams = new URLSearchParams();
    if (params?.originChainId)
      queryParams.append('originChainId', params.originChainId);
    if (params?.destinationChainId)
      queryParams.append('destinationChainId', params.destinationChainId);
    if (params?.originToken) queryParams.append('token', params.originToken);
    if (params?.destinationToken)
      queryParams.append('token', params.destinationToken);

    const url = `${ACROSS_API}/available-routes?${queryParams.toString()}`;
    const response = await get(url);
    return response.map((route: AcrossRouteResult) => ({
      originChainId: route.originChainId,
      destinationChainId: route.destinationChainId,
      destinationToken: route.destinationToken,
      originTokenSymbol: route.originToken,
      destinationTokenSymbol: route.destinationTokenSymbol,
      isNative: route.isNative,
    }));
  }

  async getDepositStatus(
    params: AcrossDepositStatusParams,
  ): Promise<AcrossDepositStatusResult> {
    const queryParams = new URLSearchParams({
      originChainId: params.originChainId,
      depositId: params.depositId,
    });
    const url = `${ACROSS_API}/deposit/status/${queryParams.toString()}`;
    const response = await get(url);
    return {
      originChainId: response.originChainId,
      depositId: response.depositId,
      depositTxHash: response.depositTxHash,
      status: response.status,
      fillTx: response.fillTx,
      destinationChainId: response.destinationChainId,
      depositRefundTxHash: response.depositTimestamp,
    };
  }
}

export function createAcrossClient(): AcrossClient {
  return new AcrossClient();
}

export type AcrossClientParams =
  | AcrossSuggestedFeesParams
  | AcrossLimitsParams
  | AcrossAvailableRoutesParams
  | AcrossDepositStatusParams;
