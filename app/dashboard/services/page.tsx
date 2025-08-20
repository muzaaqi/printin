import ServicesTable from '@/components/dashboard/services/services-table'
import { getAllPapers } from '@/features/get-all-papers';
import { getAllServices } from '@/features/get-all-services';
import React from 'react'

const ServicesPage = async () => {
  const services = await getAllServices();
  const papers = await getAllPapers();
  return (
    <div>
      <ServicesTable services={services} papers={papers} />
    </div>
  )
}

export default ServicesPage
