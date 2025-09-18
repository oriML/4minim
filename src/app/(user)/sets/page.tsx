import { SetsClientPage } from './SetsClientPage';
import { setService } from '@/features/sets/service';

export default async function Page() {
  const sets = await setService.getSets();

  return <SetsClientPage sets={sets} />;
}