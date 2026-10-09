import { createFileRoute, redirect } from '@tanstack/react-router';

// Old URLs (/klassementen/week etc.) keep working.
export const Route = createFileRoute('/klassementen/$mode')({
  beforeLoad: ({ params }) => {
    const type = params.mode === 'week' || params.mode === 'verenigingen' ? params.mode : 'overall';
    throw redirect({ to: '/klassementen', search: { type }, statusCode: 301 });
  },
});
