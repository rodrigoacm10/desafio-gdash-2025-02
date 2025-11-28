import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="bg-black min-h-screen">
      <div className="bg-white flex justify-center">
        <div className="max-w-[1250px] w-full px-5 py-2.5 flex items-center justify-between">
          <p className="text-black">alguma coisa</p>

          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="lg">
                login
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="">
                register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
