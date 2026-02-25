import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type PropertyDocument = HydratedDocument<Property>;

export enum PropertyType {
  SALE = 'sale',
  RENT = 'rent',
  LEASE = 'lease',
  SHORTLET = 'shortlet',
}

export enum PropertyCategory {
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  LAND = 'land',
}

export enum PropertyKind {
  HOUSE = 'house',
  APARTMENT = 'apartment',
  DUPLEX = 'duplex',
  VILLA = 'villa',
  LAND = 'land',
}

export enum PropertyStatus {
  AVAILABLE = 'available',
  PENDING = 'pending',
  SOLD = 'sold',
  ACTIVE = 'active',
}

@Schema({ _id: false })
class Location {
  @Prop({ type: String, enum: ['Point'], default: 'Point' })
  type!: string;

  @Prop({ type: [Number], default: [0, 0] })
  coordinates!: number[];
}

@Schema({ _id: false })
class PropertyImage {
  @Prop({ required: true })
  url!: string;

  @Prop({ required: true })
  publicId!: string;
}

@Schema({ _id: false })
class NearbyPlace {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  distance!: string;
}

@Schema({ timestamps: true })
export class Property {
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, trim: true })
  description!: string;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ type: Location })
  location?: Location;

  @Prop({ trim: true })
  address?: string;

  @Prop({ trim: true })
  city?: string;

  @Prop({ trim: true })
  area?: string;

  @Prop({ trim: true })
  state?: string;

  @Prop({
    type: String,
    enum: PropertyType,
    required: true,
  })
  type!: PropertyType;

  @Prop({
    type: String,
    enum: PropertyCategory,
    default: PropertyCategory.RESIDENTIAL,
  })
  category?: PropertyCategory;

  @Prop({
    type: String,
    enum: PropertyKind,
  })
  propertyKind?: PropertyKind;

  @Prop({ type: [String], default: [] })
  features!: string[];

  @Prop({ type: [PropertyImage], default: [] })
  images!: PropertyImage[];

  @Prop({ default: false })
  is360!: boolean;

  @Prop({
    type: String,
    enum: PropertyStatus,
    default: PropertyStatus.AVAILABLE,
  })
  status!: PropertyStatus;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  agent!: MongooseSchema.Types.ObjectId;

  @Prop({ default: 0 })
  views!: number;

  @Prop({ default: 0 })
  leads!: number;

  @Prop({ min: 0 })
  beds?: number;

  @Prop({ min: 0 })
  baths?: number;

  @Prop({ min: 0 })
  sqft?: number;

  @Prop({ min: 0 })
  parking?: number;

  @Prop()
  yearBuilt?: number;

  @Prop({ default: false })
  isVerified!: boolean;

  @Prop({ default: false })
  isFeatured!: boolean;

  @Prop({ type: String })
  paymentPeriod?: string;

  @Prop({ type: [NearbyPlace], default: [] })
  nearbyPlaces!: NearbyPlace[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', default: [] })
  favoritedBy!: MongooseSchema.Types.ObjectId[];
}

export const PropertySchema = SchemaFactory.createForClass(Property);

PropertySchema.index({ price: 1 });
PropertySchema.index({ state: 1 });
PropertySchema.index({ status: 1 });
PropertySchema.index({ type: 1 });
PropertySchema.index({ agent: 1 });
PropertySchema.index({ isFeatured: 1 });
PropertySchema.index({ 'location': '2dsphere' });

PropertySchema.set('toJSON', {
  transform: (_doc: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
