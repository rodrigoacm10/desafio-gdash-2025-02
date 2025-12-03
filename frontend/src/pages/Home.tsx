import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export const Home = () => {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <div className="bg-white flex justify-center">
        <div className="max-w-[1250px] w-full px-5 py-2.5 flex items-center justify-between">
          <p className="text-black">
            <img src="/gdash-logo-colorful.png" className="w-20" />
          </p>

          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button
                variant="ghost"
                size="lg"
                className="text-[#156e6a] font-bold hover:text-[#115c58]"
              >
                login
              </Button>
            </Link>
            <Link to="/register">
              <Button
                variant="outline"
                size="lg"
                className="bg-[#156e6a] text-white font-bold hover:bg-[#115c58] hover:text-white"
              >
                register
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative bg-[url('/home-background.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-gradient-to-b from-white/10  to-black" />

        <div className="z-50 text-5xl font-bold flex ">
          <p className="text-[#156e6a]">
            <span className="bg-white rounded-2xl px-4 py-2 bg-gradient-to-b from-white/10  to-black/30">
              Weather
            </span>{' '}
            <span className="text-white">Manegement</span>
          </p>
        </div>
      </div>
    </div>
  )
}
