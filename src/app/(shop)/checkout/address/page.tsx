import { Title } from '@/components';
import { AddressForm } from './ui/AddressForm';
import { getCountries, getUserAddress } from '@/actions';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
export default async function AddressPage() {
  const countries = await getCountries();
  const session: Session | null = await getServerSession(authOptions);
  const userAddress = await getUserAddress(session?.user?.id);

  return (
    <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">
      <div className="w-full  xl:w-[1000px] flex flex-col justify-center text-left">
        <Title title="Dirección" subtitle="Dirección de entrega" />
        <AddressForm countries={countries} userStoreAddress={userAddress ?? {}} />
      </div>
    </div>
  );
}
