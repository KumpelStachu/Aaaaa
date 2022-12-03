import { useRouter } from 'next/router'
import React from 'react'
import { trpc } from 'utils/trpc'

export default function QrCodePage() {
	const { query } = useRouter()
	const qrCode = query.qrCode as string

	trpc.place.visitPlace.useQuery(qrCode)

	return <div>OK</div>
}
