export async function updateLoopsContact(
  email: string | null | undefined,
  userId: string,
  properties: Record<string, any>
) {
  const loopsApiKey = process.env.LOOPS_API_KEY;
  if (!loopsApiKey) {
    console.error('LOOPS_API_KEY is not set. Cannot update Loops contact.');
    return;
  }

  try {
    const body = {
      email,
      userId,
      ...properties,
    };
    const response = await fetch('https://app.loops.so/api/v1/contacts/update', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${loopsApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Loops update failed (${response.status}): ${errorBody}`);
    }
  } catch (error) {
    console.error('Error updating Loops contact:', error);
  }
}
