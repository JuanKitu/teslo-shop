import Link from 'next/link';
import { getMainCategories } from '@/actions';
import clsx from 'clsx';

interface Props {
  isDark: boolean;
}

export async function MainCategories({ isDark }: Props) {
  const categories = await getMainCategories(4); // Máximo 4 para el menú

  return (
    <div className="hidden sm:flex gap-2">
      {categories.map((category) => (
        <Link
          key={category.slug}
          className={clsx(
            'px-3 py-1.5 rounded-md transition-all text-sm',
            isDark ? 'hover:bg-[#222]' : 'hover:bg-gray-100'
          )}
          href={`/category/${category.slug}`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
