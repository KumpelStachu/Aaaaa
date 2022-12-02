import NextAuth, { NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from 'server/prisma'
import { User } from '@prisma/client'

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		DiscordProvider({
			clientId: process.env.DISCORD_CLIENT_ID,
			clientSecret: process.env.DISCORD_CLIENT_SECRET,
			allowDangerousEmailAccountLinking: true,
		}),
	],
	callbacks: {
		async session({ session, user }) {
			session.user = user as User

			return session
		},
	},
}

export default NextAuth(authOptions)
