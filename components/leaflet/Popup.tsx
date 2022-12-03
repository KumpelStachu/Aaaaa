import dynamic from 'next/dynamic'

const Popup = dynamic(() => import('react-leaflet').then(v => v.Popup), {
	ssr: false,
})

export default Popup
