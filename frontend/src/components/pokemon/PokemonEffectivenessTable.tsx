import { getTypes } from '@/utils/getTypes'
import { calculateTypeEffectiveness } from '@/utils/getTypeEffectiveness'
import { BadgeType } from './BadgeType'
import type { TypeDetail } from '@/@types/types'

const getDiagonalColor = (multiplier: number) => {
  if (multiplier === 4) return 'bg-[#7c0000]'
  if (multiplier === 2) return 'bg-[#a40000]'
  if (multiplier === 0) return 'bg-[#2e3436]'
  if (multiplier === 0.5) return 'bg-[#4e9a06]'
  if (multiplier === 0.25) return 'bg-[#73d216]'
  return ''
}

export const PokemonEffectivenessTable = ({
  types,
}: {
  types: TypeDetail[]
}) => {
  const effectivenessMap = calculateTypeEffectiveness(types)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
      {getTypes.map((type) => {
        const multiplier = effectivenessMap[type] ?? 1
        const diagonalColor = getDiagonalColor(multiplier)

        return (
          <div key={type} className="flex justify-center">
            <div className="relative flex flex-col items-center p-2 rounded shadow bg-gray-50 w-full text-center overflow-hidden">
              <BadgeType type={type} />
              <p className="text-sm opacity-80 font-semibold mt-1">
                {multiplier}x
              </p>

              {diagonalColor && (
                <div
                  className={`absolute -bottom-6 -left-10 w-20 h-2 rotate-45 origin-bottom-right ${diagonalColor}`}
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
