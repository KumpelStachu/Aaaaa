import { MapContainer, TileLayer, MapContainerProps } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function ClientMap({ children, ...props }: MapContainerProps) {
	return (
		<MapContainer zoom={13} {...props}>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{children}
		</MapContainer>
	)
}
