export async function GET(request: Request) {
  console.log('Test API route called');
  return new Response(JSON.stringify({ message: 'API working' }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
