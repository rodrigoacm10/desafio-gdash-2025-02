import type { WeatherInsightItem } from '@/@types/weather-insights'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

type InsightsAccordionProps = {
  insights?: WeatherInsightItem[]
  isLoading: boolean
  isError: boolean
  error?: Error
}

export const InsightsAccordion = ({
  insights,
  isLoading,
  isError,
  error,
}: InsightsAccordionProps) => {
  return (
    <Accordion type="single" collapsible className="px-4">
      <AccordionItem value="insights">
        <AccordionTrigger className="font-bold text-[#156e6a] underline text-lg">
          Insights
        </AccordionTrigger>
        <AccordionContent className="px-2 flex flex-col gap-4">
          {isLoading && (
            <p className="text-xs text-muted-foreground">
              Gerando insights de IA...
            </p>
          )}

          {isError && (
            <p className="text-xs text-red-500">
              Erro ao carregar insights:{' '}
              {error instanceof Error ? error.message : 'Erro desconhecido'}
            </p>
          )}

          {!isLoading && !isError && insights && insights.length > 0 && (
            <>
              {insights.map((item) => (
                <div key={item.title}>
                  <p className="font-semibold text-[#156e6a]">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </>
          )}

          {!isLoading && !isError && (!insights || insights.length === 0) && (
            <p className="text-xs text-muted-foreground">
              Nenhum insight disponível para este snapshot.
            </p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
