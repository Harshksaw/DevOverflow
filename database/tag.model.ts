import { Schema, model, models, Document, Types } from 'mongoose';

export interface ITag extends Document {
  name: string;
  description: string;
  questions: Types.ObjectId[];
  followers: Types.ObjectId[];
  createdOn: Date;
}

const TagSchema = new Schema<ITag>({
  name: { type: String, required: true , unique: true},
  description: { type: String, required: true },
  questions: [{ type: Types.ObjectId, ref: 'Question' }],
  followers: [{ type: Types.ObjectId, ref: 'User' }],
  createdOn: { type: Date, default: Date.now },
});

const Tag = models.Tag || model('Tag', TagSchema);

export default Tag;