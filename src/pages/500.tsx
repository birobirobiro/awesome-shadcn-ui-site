import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const ServerError = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <motion.div
        className="m-auto min-h-screen flex justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, staggerChildren: 0.3 }}
      >
        <div className="text-center">
          <motion.h1
            className="mb-8 text-9xl font-bold"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            500
          </motion.h1>
          <motion.div
            className="mb-8 text-2xl"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            Oops! Server error occurred
          </motion.div>
          <motion.div
            className="mb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <Button variant="default" size="lg" onClick={handleGoBack}>
              Go Back
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default ServerError;
