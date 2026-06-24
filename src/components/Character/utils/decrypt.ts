export async function fetchAsset(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Asset request failed: ${response.status}`);
  return response.arrayBuffer();
}
