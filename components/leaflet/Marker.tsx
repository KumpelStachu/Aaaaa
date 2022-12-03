import dynamic from 'next/dynamic'

const Marker = dynamic(() => import('react-leaflet').then(v => v.Marker), {
	ssr: false,
})

export default Marker
