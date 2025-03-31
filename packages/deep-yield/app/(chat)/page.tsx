import { cookies } from 'next/headers';

import { Chat } from '../../components/chat';
import { DEFAULT_CHAT_MODEL } from '../../lib/ai/models';
import { generateUUID } from '../../lib/utils';
import { DataStreamHandler } from '../../components/data-stream-handler';
import { saveChat } from '../../lib/db/queries';
import { auth } from '../(auth)/auth';

export default async function Page() {
  // Generate a unique ID for the new chat
  const id = generateUUID();
  
  // Get user session
  const session = await auth();
  const userId = session?.user?.id;
  
  // Initialize the chat in the database before rendering the component
  // This ensures the server knows about the chat ID before any API calls
  if (userId) {
    try {
      // Create a placeholder chat entry with a generic title that will be updated later
      await saveChat({ 
        id, 
        userId, 
        title: 'New conversation' 
      });
      console.log(`Chat initialized in DB with ID: ${id}`);
    } catch (error) {
      console.error('Error initializing chat:', error);
      // Continue even if there's an error - the component will handle retries
    }
  }

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('chat-model');

  if (!modelIdFromCookie) {
    return (
      <>
        <Chat
          key={id}
          id={id}
          initialMessages={[]}
          selectedChatModel={DEFAULT_CHAT_MODEL}
          selectedVisibilityType="private"
          isReadonly={false}
        />
        <DataStreamHandler id={id} />
      </>
    );
  }

  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        selectedChatModel={modelIdFromCookie.value}
        selectedVisibilityType="private"
        isReadonly={false}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
