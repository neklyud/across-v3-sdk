import fetch from 'node-fetch';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function get(url: string): Promise<any> {
  try {
    if (!url) {
      throw new Error('URL is required');
    }

    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`\nHTTP error: ${JSON.stringify(data, null, 2)}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not JSON');
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch: ${error.message}`);
    }
    throw new Error('An unknown error occurred');
  }
}
