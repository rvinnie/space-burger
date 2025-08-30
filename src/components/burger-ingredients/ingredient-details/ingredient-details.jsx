import { IngredientItem } from '../ingredient-item/ingredient-item';

export const IngredientGroup = ({ ingredients, groupName }) => {
  return (
    <section>
      <h1>{groupName}</h1>
      {ingredients.map((ingredient) => (
        <IngredientItem key={ingredient._id} ingredientInfo={ingredient} />
      ))}
    </section>
  );
};
