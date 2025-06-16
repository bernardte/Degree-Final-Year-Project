import { Sparkles } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react'
import categories from "@/constant/categories";

const FilterSearch = ({
  setSearchTerm,
  searchTerm,
  filterCategory,
  setFilterCategory,
  filterStatus,
  setFilterStatus,
}: {
  setSearchTerm: Dispatch<SetStateAction<string>>;
  searchTerm: string;
  filterCategory: string;
  setFilterCategory: Dispatch<SetStateAction<string>>;
  filterStatus: string;
  setFilterStatus: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <label
            htmlFor="search"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Search Rewards
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              placeholder="Search by name or description..."
              className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-indigo-500 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Sparkles className="text-gray-400" size={18} />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="category"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="category"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="status"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id="status"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterSearch
