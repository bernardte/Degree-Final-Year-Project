import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoadingScreen = () => {
  const [text, setText] = useState("");
  const fullText = "Welcome to Seraphine Hotel";
  const navigate = useNavigate();

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.substring(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(interval);
        // After the animation is complete, navigate to homepage after 2 more seconds (or adjust as needed)
        setTimeout(() => {
          navigate("/"); // Redirect to homepage
        }, 2000); // Adjust time here based on how long you want the loading screen to stay visible after animation
      }
    }, 100);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-blue-400">
      <div className="mb-4 font-mono text-4xl font-bold text-center">
        {text} <span className="animate-blink">|</span>
      </div>

      <div className="relative h-[5px] w-[570px] overflow-hidden rounded-full bg-gray-800">
        <div className="animate-loading-bar h-full w-[40%] bg-blue-500 shadow-[0_0_15px_#3b82f6]"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
