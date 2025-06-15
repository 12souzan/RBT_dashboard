import React from 'react'
import MainLayout from './../layouts/MainLayout'
import DashboardComponent from '../components/DashboardComponent'
import { useTone } from './../context/ToneContext';
import { useAlbum } from './../context/AlbumContext';
import { useBundle } from './../context/BundleContext';
import BreadcrumbsTitle from '../components/Breadcrumbs';

function Dashboard() {
  const { tones } = useTone()
  const { albums } = useAlbum()
  const { bundles } = useBundle()

  return (
    <MainLayout>
      <BreadcrumbsTitle items={[]}/>
      <DashboardComponent
        BundlesCount={bundles.length}
        TonesCount={tones.length}
        AlbumsCount={albums.length}
      />
    </MainLayout>
  )
}

export default Dashboard