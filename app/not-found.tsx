/**
 * @file not-found.tsx
 * @description Custom 404 (Not Found) page for the Pure Hearts project.
 * This page is displayed automatically for all routes that do not exist.
 * It maintains consistent styling and user experience with the rest of the app.
 *
 * @version 1.2.0
 * @since 2025-11-10
 * @author Khadis
 */

"use client";

import { useRouter } from "next/navigation"; // For programmatic navigation
import { Button } from "@/src/components/ui/button"; // ShadCN Button component
import { motion } from "framer-motion"; // For subtle animations
import { Home } from "lucide-react"; // Icon for the Home button
import { JSX } from "react";

/**
 * @function NotFoundPage
 * @description Renders a friendly 404 message with a "Back to Home" button.
 * @returns {JSX.Element} Styled Not Found page component.
 */
const NotFoundPage = (): JSX.Element => {
  const router = useRouter(); // Next.js router instance

  /**
   * Handles click event to navigate the user back to the homepage.
   */
  const handleGoHome = () => {
    router.push("/"); // Redirect user to the homepage
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-center px-4">
      {/* ==== Animated Container ==== */}
      <motion.div
        initial={{ opacity: 0, y: 30 }} // Start slightly faded and moved down
        animate={{ opacity: 1, y: 0 }} // Fade in and move up
        transition={{ duration: 0.6 }} // Smooth transition duration
        className="max-w-lg mx-auto"
      >
        {/* ==== 404 Header ==== */}
        <h1 className="text-7xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
          404
        </h1>

        {/* ==== Message ==== */}
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          The page you’re looking for doesn’t exist or may have been moved.  
          Try checking the URL or go back to the homepage.
        </p>

        {/* ==== Home Button with Motion Hover Effect ==== */}
        <motion.div
          whileHover={{ scale: 1.04 }} // Slight bounce when hovered
          whileTap={{ scale: 0.96 }} // Compress slightly on click
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <Button
            onClick={handleGoHome}
            className="flex items-center gap-2 mx-auto bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-xl shadow-md"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Button>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default NotFoundPage;
