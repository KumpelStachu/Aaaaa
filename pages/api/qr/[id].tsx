import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import { QRCodeSVG } from 'qrcode.react'

export const config = {
	runtime: 'experimental-edge',
}

export default function handler(req: NextRequest) {
	const url = new URL(req.url)
	url.pathname = url.pathname.slice(4)

	return new ImageResponse(
		(
			<div
				style={{
					fontSize: 128,
					background: 'white',
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<QRCodeSVG value={url.toString()} width={720} height={720} />
			</div>
		),
		{
			width: 800,
			height: 800,
		}
	)
}
