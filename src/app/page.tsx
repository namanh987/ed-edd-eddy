'use client'

import Link from 'next/link'
import { useUser, SignInButton } from '@clerk/nextjs'

export default function Home() {
  const { isSignedIn } = useUser()

  return (
    <main className="min-h-screen bg-white flex flex-col">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <span className="font-semibold text-gray-900 text-lg">
          Ed, Edd n Eddy
        </span>
        <div className="flex gap-3">
          {isSignedIn ? (
            <Link
              href="/chat"
              className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go to chat
            </Link>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Sign in
                </button>
              </SignInButton>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <p className="text-sm font-medium text-emerald-600 mb-4 tracking-wide uppercase">
          AI English Companions
        </p>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 max-w-2xl leading-tight">
          Practice English with three unique friends
        </h1>
        <p className="text-lg text-gray-500 mb-12 max-w-xl">
          Ed encourages you. Edd teaches you the rules. Eddy shows you how people really talk.
          Pick your companion and start chatting.
        </p>

        {/* Three companions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-3xl">
          <div className="border border-gray-100 rounded-2xl p-6 text-left hover:border-emerald-200 hover:shadow-sm transition-all">
            <div className="text-3xl mb-3">🟢</div>
            <h3 className="font-semibold text-gray-900 mb-1">Ed</h3>
            <p className="text-sm text-gray-500">Warm and encouraging. Perfect for beginners who need confidence.</p>
          </div>
          <div className="border border-gray-100 rounded-2xl p-6 text-left hover:border-purple-200 hover:shadow-sm transition-all">
            <div className="text-3xl mb-3">🟣</div>
            <h3 className="font-semibold text-gray-900 mb-1">Edd</h3>
            <p className="text-sm text-gray-500">Precise and scholarly. Explains grammar rules and the why behind them.</p>
          </div>
          <div className="border border-gray-100 rounded-2xl p-6 text-left hover:border-orange-200 hover:shadow-sm transition-all">
            <div className="text-3xl mb-3">🟠</div>
            <h3 className="font-semibold text-gray-900 mb-1">Eddy</h3>
            <p className="text-sm text-gray-500">Street-smart and fun. Teaches slang, idioms and real-world English.</p>
          </div>
        </div>

        {isSignedIn ? (
          <Link
            href="/chat"
            className="px-8 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Go to chat
          </Link>
        ) : (
          <Link
            href="/sign-up"
            className="px-8 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Start for free
          </Link>
        )}
      </section>

      {/* Footer */}
      <footer className="px-8 py-5 border-t border-gray-100 text-center text-sm text-gray-400">
        In honour of Edward — Ed, Edd n Eddy
      </footer>

    </main>
  )
}