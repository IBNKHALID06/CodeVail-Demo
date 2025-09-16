import { notFound } from "next/navigation"

export default function WorkingLoginRemoved() {
  // Legacy route removed; surface 404 to avoid conflicts with canonical /login
  notFound()
}
