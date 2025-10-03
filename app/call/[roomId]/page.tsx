import CallPage from "../../../src/views/CallPage"

export default function Page() {
  return <CallPage />
}

// Static export compliance: don't pre-render dynamic rooms.
// We won't generate any params; route should be reached via client-side navigation.
export function generateStaticParams(): { roomId: string }[] {
  return [{ roomId: 'sample-room' }]
}

// Disallow unknown params at runtime in export mode
export const dynamicParams = false

// Force this segment to be treated as static in export mode
export const dynamic = 'force-static'
