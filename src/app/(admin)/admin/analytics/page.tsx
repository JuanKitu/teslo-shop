import { getSearchAnalytics } from '@/actions';
import { SearchAnalyticsTable } from '@/components';

export default async function AdminAnalyticsPage() {
  const { analytics } = await getSearchAnalytics();

  return (
    <div className="container mx-auto py-10 px-5">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics de Búsquedas</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Analiza qué buscan tus clientes y optimiza tu catálogo
        </p>
      </div>

      <SearchAnalyticsTable analytics={analytics} />
    </div>
  );
}
