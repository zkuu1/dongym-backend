import { ZodError } from 'zod';


export function formatZodIssues(issues: ZodError['issues']) {
  const errors: Record<string, string> = {};

  for (const issue of issues) {
    const field = issue.path.join('.') || 'body';
    errors[field] = issue.message;
  }

  return errors;
}
