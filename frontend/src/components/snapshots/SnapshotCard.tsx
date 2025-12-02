import type { WeatherSnapshot } from '@/@types/weather'
import { formatDate } from '@/utils/formatters/formatData'
import { Link } from 'react-router-dom'

export const SnapshotCard = ({ snapshot }: { snapshot: WeatherSnapshot }) => {
  return (
    // <Link to={`/dashboard?sanpshotId=${snapshot.id}`}>
    <Link to={`/dashboard?snapshotId=${snapshot.id}`}>
      <div className="cursor-pointer border px-5 py-4 rounded-2xl flex justify-between">
        <div>
          <div>
            <p className="text-[#156e6a] text-xl font-bold mb-1">
              {formatDate(snapshot.fetchedAt)}
            </p>
            <p className="font-medium text-[#156e6a]/80">
              {snapshot.location.city}
              {snapshot.location.state ? `, ${snapshot.location.state}` : ''}
              {' - '}
              {snapshot.location.country}
            </p>
            <p className="text-sm mt-1 text-muted-foreground">
              lat:{' '}
              <span className="font-bold">
                {snapshot.location.lat.toFixed(4)}
              </span>{' '}
              - lon:{' '}
              <span className="font-bold">
                {snapshot.location.lon.toFixed(4)}
              </span>
            </p>
          </div>

          <div className="text-sm mt-2 text-muted-foreground">
            <p>
              Current temp:{' '}
              <span className="font-bold">
                {snapshot.current.temperature.toFixed(1)} °C
              </span>{' '}
              - Feels like:{' '}
              <span className="font-bold">
                {snapshot.current.feelsLike.toFixed(1)} °C
              </span>{' '}
              - Condition:{' '}
              <span className="font-bold">
                {snapshot.current.condition.description}
              </span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
