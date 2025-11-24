import React from 'react';
import { Title } from '@/components';
import FavoriteCleanList from './ui/FavoriteCleanList';
import FavoriteList from './ui/FavoriteList';

export default function FavoritesPage() {
  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <Title title="Mis favoritos" subtitle="Productos que te encantaron" />
        <FavoriteCleanList />
      </div>
      <FavoriteList />
    </div>
  );
}
