import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="w-full max-w-md space-y-8 px-4 py-8 text-center">
        <h1 className="text-3xl font-bold">Authentication Error</h1>
        <p className="text-muted-foreground">
          There was an error processing your authentication request.
          This can happen if you've already used this sign-up link or if it has expired.
        </p>
        <div className="mt-4">
          <Link href="/login">
            <Button>
              Return to login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 