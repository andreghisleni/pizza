import type { NextAuthConfig, Session } from 'next-auth'

import { credentialsProvider } from './credentials-provider'

export const authConfig = {
  // adapter: PrismaAdapter(prisma), // eslint-disable-line
  providers: [credentialsProvider],
  pages: {
    signIn: '/auth/sign-in',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'credentials') {
        console.log('credentials', account, profile)

        return true
      }

      return false
    },
    jwt({ token, user, session, trigger }) {
      if (user) {
        token.type = user.type
      }

      function isSessionAvailable(session: unknown): session is Session {
        return !!session
      }

      if (trigger === 'update' && isSessionAvailable(session)) {
        console.log('session', session)
        console.log('token', token)
        token.name = session.user.name
        token = {
          ...token,
          type: session.user.type,
          user: session,
        }
      }

      return token
    },
    session({ session, ...params }) {
      if ('token' in params && session.user) {
        session.user.type = params.token.type
        session.user.id = params.token.sub!
      }

      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      // const isAdmin = auth?.user?.type === 'ADMIN'
      const isDefault = auth?.user?.type === 'DEFAULT'

      const isOnPublicPages = nextUrl.pathname.startsWith('/auth')
      const isOnWebhooks = nextUrl.pathname.startsWith('/api/webhooks')
      const isOnPublicAPIRoutes = nextUrl.pathname.startsWith('/api/auth')
      const isOnAPIRoutes = nextUrl.pathname.startsWith('/api')
      const isOnPrivatePages = !isOnPublicPages
      // const isOnOnboarding = nextUrl.pathname.startsWith('/onboarding')

      const isOnPublicPage =
        nextUrl.pathname.startsWith('/p/') ||
        nextUrl.pathname.startsWith('/404') ||
        !nextUrl.pathname.startsWith('/app')

      if (isOnPublicPage || (isOnPublicPage && isLoggedIn)) {
        return true
      }

      if (isOnWebhooks || isOnPublicAPIRoutes) {
        return true
      }
      // console.log('nextUrl', nextUrl)

      if (isOnPublicPages && isLoggedIn) {
        return Response.redirect(new URL('/app/dashboard', nextUrl))
      }

      if (isOnAPIRoutes && !isLoggedIn) {
        return Response.json({ message: 'Unauthorized.' }, { status: 401 })
      }

      if (isOnPrivatePages && !isLoggedIn) {
        return false
      }

      // if (
      //   isActivity &&
      //   !(isOnActivityPage || isOnPointDiscountPage || isOnVotePage)
      // ) {
      //   return Response.redirect(new URL(`/activity/${scoutGroupId}`, nextUrl))
      // }

      console.log('here', {
        isDefault,
        type: auth?.user?.type,
      })

      // if (
      //   isLoggedIn &&
      //   isOnPrivatePages &&
      //   !auth?.user?.scoutGroupId &&
      //   !isOnOnboarding
      // ) {
      //   return Response.redirect(new URL('/onboarding', nextUrl))
      // }

      return true
    },
  },
} satisfies NextAuthConfig
