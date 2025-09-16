"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface RouteGuardProps {
  children: React.ReactNode
  allowedUserTypes: string[]
  redirectTo?: string
}

export function RouteGuard({ children, allowedUserTypes, redirectTo = "/login" }: RouteGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const userType = localStorage.getItem("userType")

      if (!userType || !allowedUserTypes.includes(userType)) {
        router.push(redirectTo)
        return
      }

      setIsAuthorized(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [allowedUserTypes, redirectTo, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-700">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
