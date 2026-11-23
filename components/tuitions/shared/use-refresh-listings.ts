"use client"

import { useEffect, useRef } from "react"

import { useSession } from "@/lib/auth-client"

export function useRefreshListingsOnAccountChange(refresh: () => void) {
  const { data, isPending } = useSession()
  const user = data?.user
  const account = user ? `${user.id}:${user.role ?? "student"}` : "guest"
  const previousAccount = useRef<string>(undefined)

  useEffect(() => {
    if (isPending) return
    const changed =
      previousAccount.current !== undefined &&
      previousAccount.current !== account
    previousAccount.current = account
    if (changed) refresh()
  }, [account, isPending, refresh])

  return user
}
