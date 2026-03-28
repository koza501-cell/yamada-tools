import { redirect } from 'next/navigation';

export default function TextCounterRedirect() {
  redirect('/generator/character-count');
}
