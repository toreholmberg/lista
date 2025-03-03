"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setMessage({ text: error.message, type: 'error' })
        return
      }

      setMessage({ 
        text: "Check your email for the magic link to log in!", 
        type: 'success' 
      })
    } catch (err) {
      setMessage({ text: "An unexpected error occurred", type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="w-full max-w-md space-y-8 px-4 py-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            We'll send you a magic link to your email
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {message && (
            <div className={`text-center text-sm ${
              message.type === 'error' ? 'text-red-500' : 'text-green-500'
            }`}>
              {message.text}
            </div>
          )}

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Sending magic link..." : "Send magic link"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 