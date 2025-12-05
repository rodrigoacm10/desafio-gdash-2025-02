import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
class ConditionSchema {
  @Prop() id: number;
  @Prop() main: string;
  @Prop() description: string;
  @Prop() icon: string;
}
const ConditionSchemaDef = SchemaFactory.createForClass(ConditionSchema);

@Schema({ _id: false })
class CurrentSchema {
  @Prop() timestamp: string;
  @Prop() temperature: number;
  @Prop() feelsLike: number;
  @Prop() humidity: number;
  @Prop() pressure: number;
  @Prop() dewPoint?: number;
  @Prop() uvi?: number;
  @Prop() clouds?: number;
  @Prop() visibility?: number;
  @Prop() windSpeed?: number;
  @Prop() windDeg?: number;
  @Prop() rainLastHour?: number;
  @Prop() rainProbability?: number;

  @Prop({ type: ConditionSchemaDef })
  condition: ConditionSchema;

  @Prop({ type: Object })
  metadata?: Record<string, number>;
}
const CurrentSchemaDef = SchemaFactory.createForClass(CurrentSchema);

@Schema({ _id: false })
class HourlyEntrySchema extends CurrentSchema {}
const HourlyEntrySchemaDef = SchemaFactory.createForClass(HourlyEntrySchema);

@Schema({ _id: false })
class DailyEntrySchema {
  @Prop() date: string;
  @Prop() tempMin?: number;
  @Prop() tempMax?: number;
  @Prop() tempDay?: number;
  @Prop() tempNight?: number;
  @Prop() humidity?: number;
  @Prop() pressure?: number;
  @Prop() dewPoint?: number;
  @Prop() windSpeed?: number;
  @Prop() windDeg?: number;
  @Prop() uvi?: number;
  @Prop() clouds?: number;
  @Prop() rainProbability?: number;
  @Prop() rainAmount?: number;

  @Prop({ type: ConditionSchemaDef })
  condition: ConditionSchema;

  @Prop({ type: Object })
  metadata?: Record<string, number>;
}
const DailyEntrySchemaDef = SchemaFactory.createForClass(DailyEntrySchema);

@Schema({ _id: false })
class LocationSchema {
  @Prop() city: string;
  @Prop() state: string;
  @Prop() country: string;
  @Prop() lat: number;
  @Prop() lon: number;
  @Prop() timezone: string;
  @Prop() timezoneOffset: number;
}
const LocationSchemaDef = SchemaFactory.createForClass(LocationSchema);

@Schema({
  collection: 'weather_snapshots',
  timestamps: { createdAt: true, updatedAt: false },
})
export class WeatherSnapshotDocument extends Document {
  @Prop() provider: string;
  @Prop() type: string;

  @Prop({ type: LocationSchemaDef })
  location: LocationSchema;

  @Prop() fetchedAt: string;

  @Prop({ type: CurrentSchemaDef })
  current: CurrentSchema;

  @Prop({ type: [HourlyEntrySchemaDef] })
  hourly: HourlyEntrySchema[];

  @Prop({ type: [DailyEntrySchemaDef] })
  daily: DailyEntrySchema[];

  @Prop() createdAt: Date;
}

export const WeatherSnapshotSchema = SchemaFactory.createForClass(
  WeatherSnapshotDocument,
);
