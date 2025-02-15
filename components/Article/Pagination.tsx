import { motion } from "framer-motion";

export default function Pagination({
  articlesPerPage,
  totalArticles,
  paginate,
  currentPage,
}: {
  articlesPerPage: number;
  totalArticles: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalArticles / articlesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="mt-8">
      <ul className="flex justify-center space-x-2">
        {pageNumbers.map((number) => (
          <motion.li key={number} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <button
              onClick={() => paginate(number)}
              className={`px-4 py-2 rounded-md ${
                currentPage === number ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {number}
            </button>
          </motion.li>
        ))}
      </ul>
    </nav>
  );
}