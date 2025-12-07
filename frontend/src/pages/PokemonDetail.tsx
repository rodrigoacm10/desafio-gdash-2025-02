import { Link, useParams } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { LoadingIcon } from '@/components/icons/LoadingIcon'
import { BadgeType } from '@/components/pokemon/BadgeType'
import { StateMessage } from '@/components/StateMessage'
import { useGetPokemonDetails } from '@/hooks/pokemon/useGetPokemonDetails'
import { InfoBlock } from '@/components/pokemon/InfoBlock'
import { PokemonChainList } from '@/components/pokemon/PokemonChainList'
import { SpriteHoverAnimated } from '@/components/pokemon/SpriteHoverAnimated'
import { StatsChart } from '@/components/charts/StatsChart'
import { Button } from '@/components/ui/button'
import { IconArrowLeft, IconMicrophone } from '@tabler/icons-react'
import { PokemonEffectivenessTable } from '@/components/pokemon/PokemonEffectivenessTable'
import { PokemonMoviments } from '@/components/pokemon/PokemonMoviments'

export function PokemonDetail() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError } = useGetPokemonDetails(id)

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <LoadingIcon />
      </div>
    )
  }

  if (
    isError ||
    !data?.pokemon ||
    !data?.species ||
    !data?.abilities ||
    !data.chain ||
    !data.types
  ) {
    return (
      <StateMessage
        img="../../public/not-found-icon.png"
        alt="Ícone de não encontrado"
        text="Pokémon não encontrado"
        color="text-[#6d6e71]"
      />
    )
  }

  const { pokemon, species, abilities, chain, types } = data

  const handleRoar = () => {
    const cryUrl = pokemon?.cries?.latest || pokemon?.cries?.legacy
    if (!cryUrl) {
      return
    }

    const audio = new Audio(cryUrl)
    audio.play().catch(() => {})
  }

  return (
    <div className="flex flex-col flex-1 h-full">
      <Link to="/pokemon" className="mb-4">
        <Button className="bg-[#156e6a] text-white hover:bg-[#115c58]">
          <IconArrowLeft /> Voltar
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-[35fr_65fr] gap-2">
        <div className="flex-col h-full">
          <Card className="p-6">
            <div className="mb-2">
              <h2 className="font-bold text-[#156e6a] text-2xl capitalize">
                {pokemon.name.split('-').join(' ')}
              </h2>
              <p className="text-lg font-semibold opacity-50">
                #{pokemon.id.toString().padStart(4, '0')}
              </p>
            </div>

            <SpriteHoverAnimated
              pokemon={pokemon}
              className="!w-40 !h-40 mx-auto mb-4"
            />

            <div className="flex justify-center gap-2 mt-2">
              {pokemon.types.map((t) => (
                <BadgeType key={t.type.name} type={t.type.name} />
              ))}
            </div>

            <div className="flex justify-center ">
              <Button
                className="bg-[#156e6a] text-white hover:bg-[#115c58]"
                onClick={() => handleRoar()}
              >
                Rugir <IconMicrophone />
              </Button>
            </div>

            <p className="mt-4">
              {
                species?.flavor_text_entries.find(
                  (f) => f.language.name === 'en',
                )?.flavor_text
              }
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              <InfoBlock
                minW={80}
                upper={false}
                label="Altura"
                value={`${pokemon.height / 10} m`}
              />
              <InfoBlock
                minW={80}
                upper={false}
                label="Peso"
                value={`${pokemon.weight / 10} kg`}
              />
              <InfoBlock
                minW={80}
                upper={false}
                label="Bebê"
                value={species?.is_baby ? 'Sim' : 'Não'}
              />
              <InfoBlock
                minW={80}
                upper={false}
                label="Lendário"
                value={species?.is_legendary ? 'Sim' : 'Não'}
              />
              <InfoBlock
                minW={80}
                upper={false}
                label="Mítico"
                value={species?.is_mythical ? 'Sim' : 'Não'}
              />
            </div>
          </Card>

          <div className="my-4 w-full">
            <h3 className="font-bold text-[#156e6a] text-center text-lg mb-3">
              Cadeia evolutiva
            </h3>
            {chain.length > 1 ? (
              <PokemonChainList chain={chain} />
            ) : (
              <p className="font-bold text-[#156e6a] text-center opacity-60">
                Evolução única
              </p>
            )}
          </div>
        </div>

        <div className="flex-1">
          <Card className="p-6 h-full">
            <h2 className="text-2xl font-bold text-[#156e6a]">
              Status e características
            </h2>

            <div className="flex flex-wrap gap-2">
              {pokemon.stats.map((stat) => (
                <InfoBlock
                  key={stat.stat.name}
                  minW={120}
                  label={stat.stat.name}
                  value={stat.base_stat}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
              <div className="flex-1">
                <div className="w-full h-44">
                  <StatsChart stats={pokemon.stats} />
                </div>
              </div>

              <div className="flex-2">
                <h3 className="font-bold text-[#156e6a] text-lg">
                  Habilidades
                </h3>
                <div className="flex flex-col gap-3 mt-2">
                  {abilities.map((ability) => {
                    const name =
                      ability.names.find((n) => n.language.name === 'en')
                        ?.name || ability.name
                    const effect =
                      ability.effect_entries.find(
                        (e) => e.language.name === 'en',
                      )?.short_effect || 'Nenhuma descrição disponível'

                    return (
                      <div
                        key={ability.id}
                        className="p-2 rounded shadow bg-gray-50"
                      >
                        <p className="font-semibold capitalize">{name}</p>
                        <p className="text-sm opacity-80">{effect}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-[#156e6a] text-lg text-center mb-4">
                Efetividade dos tipos
              </h3>
              <PokemonEffectivenessTable types={types} />
            </div>

            <div className="">
              <PokemonMoviments moves={pokemon.moves} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
