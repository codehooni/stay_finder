import type { ReactNode } from 'react';

interface StateBlockProps {
  title: string;
  body: string;
  action?: ReactNode;
}

export function StateBlock({ title, body, action }: StateBlockProps) {
  return (
    <section className="state-block" aria-live="polite">
      <h2>{title}</h2>
      <p>{body}</p>
      {action}
    </section>
  );
}
