import type { WeatherInsightAlert } from '@/@types/weather-insights'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

type AlertsAccordionProps = {
  alerts?: WeatherInsightAlert[]
  isLoading: boolean
  isError: boolean
  error?: Error
}

export const AlertsAccordion = ({
  alerts,
  isLoading,
  isError,
  error,
}: AlertsAccordionProps) => {
  return (
    <Accordion type="single" collapsible className="px-4">
      <AccordionItem value="alerts">
        <AccordionTrigger className="font-bold text-[#156e6a] underline text-lg">
          Alerts
        </AccordionTrigger>
        <AccordionContent className="px-2 flex flex-col gap-4">
          {isLoading && (
            <p className="text-xs text-muted-foreground">
              Gerando alertas de clima...
            </p>
          )}

          {isError && (
            <p className="text-xs text-red-500">
              Erro ao carregar alertas:{' '}
              {error instanceof Error ? error.message : 'Erro desconhecido'}
            </p>
          )}

          {!isLoading && !isError && alerts && alerts.length > 0 && (
            <>
              {alerts.map((alert) => (
                <div key={alert.type}>
                  <p className="font-semibold text-[#156e6a]">
                    {alert.type.replaceAll('_', ' ')}{' '}
                    <span className="text-xs uppercase text-muted-foreground">
                      ({alert.severity})
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {alert.description}
                  </p>
                </div>
              ))}
            </>
          )}

          {!isLoading && !isError && (!alerts || alerts.length === 0) && (
            <p className="text-xs text-muted-foreground">
              Nenhum alerta relevante para este snapshot.
            </p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
