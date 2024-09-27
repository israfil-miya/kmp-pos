import mongoose from 'mongoose';

export interface Category extends mongoose.Document {
  name: string;
}

const CategorySchema = new mongoose.Schema<Category>({
  name: {
    type: String,
    required: [true, 'Name is not given'],
    unique: true,
    minlength: [1, 'Name must be at least 1 character'],
  },
});

const Category =
  (mongoose.models.Category as mongoose.Model<Category>) ||
  mongoose.model<Category>('Category', CategorySchema);

export default Category;
