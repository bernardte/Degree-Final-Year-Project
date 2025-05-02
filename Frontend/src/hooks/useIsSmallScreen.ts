import { useEffect, useState } from "react";

const useIsSmallScreen = () => {
    const [isSmall, setIsSmall] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsSmall(window.innerWidth < 768);
        }

        checkScreenSize(); // Check on mount
        window.addEventListener('resize', checkScreenSize); // Check on resize
        return () => window.removeEventListener('resize', checkScreenSize); // Cleanup
    }, [])

    return isSmall;
}

export default useIsSmallScreen;
