import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
class WeatherAlertSchema {
  @Prop() type: string;
  @Prop() description: string;
  @Prop() severity: string;
  @Prop() icon?: string;
}

const WeatherAlertSchemaDef = SchemaFactory.createForClass(WeatherAlertSchema);

@Schema({ _id: false })
class WeatherInsightMetricsSchema {
  @Prop() comfortIndex: number;
  @Prop() trendTemperature: string;
  @Prop() trendRain: string;
}

const WeatherInsightMetricsSchemaDef = SchemaFactory.createForClass(
  WeatherInsightMetricsSchema,
);

@Schema({ _id: false })
class WeatherInsightItemSchema {
  @Prop() title: string;
  @Prop() description: string;
}

const WeatherInsightItemSchemaDef = SchemaFactory.createForClass(
  WeatherInsightItemSchema,
);

@Schema({
  collection: 'weather_insights',
  timestamps: { createdAt: true, updatedAt: false },
})
export class WeatherInsightDocument extends Document {
  @Prop({ required: true })
  snapshotId: string;

  @Prop({ required: true })
  summary: string;

  @Prop({ type: [WeatherAlertSchemaDef], default: [] })
  alerts: WeatherAlertSchema[];

  @Prop({ type: WeatherInsightMetricsSchemaDef, required: true })
  metrics: WeatherInsightMetricsSchema;

  @Prop({ type: [WeatherInsightItemSchemaDef], default: [] })
  insights: WeatherInsightItemSchema[];

  @Prop()
  createdAt: Date;
}

export const WeatherInsightSchema = SchemaFactory.createForClass(
  WeatherInsightDocument,
);
