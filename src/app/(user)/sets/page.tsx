import { getSetsAction } from '@/features/sets/actions';
import { SetsClientPage } from './SetsClientPage';

export default async function Page() {
  const sets = await getSetsAction();

  return <SetsClientPage sets={sets} />;
}