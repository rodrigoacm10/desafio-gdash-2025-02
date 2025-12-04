import { useState } from 'react'
import type { Moves } from '@/@types/pokemon'
import { PokemonMoveDetails } from './PokemonMoveDetails'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../ui/accordion'

export const PokemonMoviments = ({ moves }: { moves: Moves[] }) => {
  const [activeKey, setActiveKey] = useState<string[]>([])

  return (
    <Accordion type="multiple" value={activeKey} onValueChange={setActiveKey}>
      <AccordionItem value="movements">
        <AccordionTrigger className="border flex justify-center text-center font-bold text-lg">
          Movements ({moves.length})
        </AccordionTrigger>
        <AccordionContent>
          {moves.map((move, index) => (
            <AccordionItem key={index} value={`move-${index}`}>
              <AccordionTrigger className="capitalize font-medium">
                {move.move.name.replace(/-/g, ' ')}
              </AccordionTrigger>
              <AccordionContent>
                <PokemonMoveDetails
                  url={move.move.url}
                  versionDetails={move.version_group_details}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
