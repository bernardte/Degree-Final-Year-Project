interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter = ({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) => {
  const categories = [
    { id: "all", name: "All Rewards" },
    { id: "Accommodation", name: "Accodomation" },
    { id: "Membership", name: "Membership" },
    { id: "Dining", name: "Dining" },
    { id: "Service", name: "Service" },
    { id: "Other", name: "Other" },
  ];

  return (
    <div className="mb-8 flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
            selectedCategory === category.id
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
