import dynamic from 'next/dynamic'

// Dynamically import to avoid SSR issues
const TechInterviewPage = dynamic(() => import('../../../src/views/TechInterviewPage'), { ssr: false })

export default function TechInterviewDynamicRoute() {
  return <TechInterviewPage />
}

// Static export compliance: don't pre-render dynamic test pages
export function generateStaticParams(): { testId: string }[] {
  return [{ testId: 'sample-test' }]
}

export const dynamicParams = false
