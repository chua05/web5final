'use client'

import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'

const Chart = dynamic(() => import('react-apexcharts'), { 
  ssr: false,
  loading: () => <div className="h-[350px] flex items-center justify-center">Loading chart...</div>
})

interface AnalyticsChartProps {
  usersCount: number
  postsCount: number
  commentsCount: number
}

export default function AnalyticsChart({ 
  usersCount, 
  postsCount, 
  commentsCount 
}: AnalyticsChartProps) {
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 10
      },
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['Users', 'Posts', 'Comments']
    },
    colors: ['#3B82F6', '#10B981', '#F59E0B']
  }

  const series = [{
    name: 'Count',
    data: [usersCount, postsCount, commentsCount]
  }]

  return (
    <Chart
      options={options}
      series={series}
      type="bar"
      height={350}
    />
  )
}