'use client';

interface ErrorViewProps {
  msg: string;
}

export default function ErrorView({ msg }: ErrorViewProps) {
  return (
    <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
      <h2>Error</h2>
      <p>{msg}</p>
    </div>
  );
} 