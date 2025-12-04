import { useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { setSearchTerm } from '@/store/pokemonSlice'
import { useState, useEffect } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Search } from 'lucide-react'

export const PokemonSearch = ({
  redirectToHome = false,
}: {
  redirectToHome?: boolean
}) => {
  const { searchTerm } = useAppSelector((state) => state.pokemon)
  const [localValue, setLocalValue] = useState(searchTerm)

  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()

  useEffect(() => {
    setLocalValue(searchTerm)
  }, [searchTerm])

  const handleSearch = () => {
    dispatch(setSearchTerm(localValue.trim().split(' ').join('-')))

    if (redirectToHome && location.pathname !== '/') {
      navigate('/')
    }
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Search Pokemon..."
        value={localValue.split('-').join(' ')}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyUp={handleKeyUp}
        className="!px-4 !py-5 !text-[16px]"
      />

      <Button
        className="bg-[#156e6a] hover:bg-[#115c58] py-5 px-4 font-bold cursor-pointer"
        onClick={handleSearch}
      >
        <Search />
      </Button>
    </div>
  )
}
// bg-[#156e6a] text-white font-semibold hover:bg-[#115c58]
