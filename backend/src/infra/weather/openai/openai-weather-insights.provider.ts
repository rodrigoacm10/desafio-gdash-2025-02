import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';

import {
  GeneratedWeatherInsightPayload,
  IWeatherInsightsLLM,
} from '../../../application/weather/ports/weather-insights-llm.port';
import { WeatherSnapshot } from '../../../domain/weather/weather-snapshot.entity';

@Injectable()
export class OpenAIWeatherInsightsProvider implements IWeatherInsightsLLM {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateFromSnapshot(
    snapshot: WeatherSnapshot,
  ): Promise<GeneratedWeatherInsightPayload> {
    if (!process.env.OPENAI_API_KEY) {
      throw new InternalServerErrorException(
        'OPENAI_API_KEY não configurada no ambiente.',
      );
    }

    const prompt = this.buildPrompt(snapshot);

    const completion = await this.client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? 'gpt-4.1-mini',
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content:
            'Você é um meteorologista especialista + cientista de dados de clima.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new InternalServerErrorException(
        'Resposta vazia da API do ChatGPT ao gerar insights.',
      );
    }

    let parsed: GeneratedWeatherInsightPayload;
    try {
      parsed = JSON.parse(content) as GeneratedWeatherInsightPayload;
    } catch (error) {
      throw new InternalServerErrorException(
        'Falha ao fazer parse do JSON retornado pelo ChatGPT.',
      );
    }

    return parsed;
  }

  private buildPrompt(snapshot: WeatherSnapshot): string {
    const snapshotJson = JSON.stringify(snapshot, null, 2);

    return `
Você é um meteorologista especialista + cientista de dados de clima.
Sua tarefa é analisar um snapshot climático completo e gerar insights acionáveis, simples de ler e úteis para um dashboard.

Regras:

Sempre responda em JSON válido.

Crie insights baseados em tendências, risco, alertas, conforto climático e resumo geral.

Não invente dados. Use apenas informações do snapshot.

Identifique padrões nas seções:

current
hourly
daily

Gere insights claros, úteis e práticos.

Use linguagem natural, tom profissional.

Gere também uma classificação do clima atual.

USER

Analise o seguinte snapshot climático e gere insights seguindo o formato pedido.

Dados:

${snapshotJson}

Retorne exatamente no seguinte formato:

{
  "summary": "string — resumo geral do clima",
  "alerts": [
    {
      "type": "string — calor_extremo | chuva_forte | vento_forte | uv_alto | clima_agradavel | risco_moderado | etc",
      "description": "string",
      "severity": "low | medium | high",
      "icon": "string — opcional para UI"
    }
  ],
  "metrics": {
    "comfortIndex": "0–100",
    "trendTemperature": "subindo | caindo | estável",
    "trendRain": "aumentando | diminuindo | estável"
  },
  "insights": [
    {
      "title": "string",
      "description": "string"
    }
  ]
}

Seja direto, técnico e baseado em dados.
    `.trim();
  }
}
