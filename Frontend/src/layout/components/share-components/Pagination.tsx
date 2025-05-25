interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  return (
    <div className="mt-4 flex justify-center space-x-2 text-sm">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded px-3 py-1 text-blue-600 disabled:opacity-30"
      >
        Previous
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`rounded px-3 py-1 ${
            currentPage === i + 1
              ? "bg-blue-600 text-white"
              : "text-blue-600 hover:bg-blue-100"
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded px-3 py-1 text-blue-600 disabled:opacity-30"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
