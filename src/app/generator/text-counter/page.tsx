import { redirect } from 'next/navigation';

export default function TextCounterRedirect() {
  redirect('/generator/text-case');
}
