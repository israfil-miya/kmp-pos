import mongoose from 'mongoose';

interface Category {
  name: string;
}

const CategorySchema = new mongoose.Schema<Category>(
  {
    name: {
      type: String,
      required: [true, 'Name is not given'],
      unique: true,
      validate: {
        validator: function (v: string) {
          return v.trim().length > 0;
        },
        message: 'Name cannot be empty',
      },
    },
  },
  { timestamps: true },
);

const Category =
  mongoose.models.Category ||
  mongoose.model<Category>('Category', CategorySchema);

export default Category;
