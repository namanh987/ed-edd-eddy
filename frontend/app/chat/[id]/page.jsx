import ChatPage from '@/components/ChatPage';

export default function Page({ params }) {
  return <ChatPage conversationId={params.id} />;
}
