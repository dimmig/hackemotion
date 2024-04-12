import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

const Reveal = ({
                    children,
                    delay = 0, // По умолчанию delay равно 0
                    isScale,
                    isCentered,
                    isFull = true,
                    styles,
                    animationDuration = 0.5,
                }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible");
            window.scrollTo(0, 0);
        }
    }, [isInView]);

    return (
        <motion.div
            ref={ref}
            variants={
                isScale
                    ? {
                        hidden: { opacity: 0, scale: 0 },
                        visible: { opacity: 1, scale: 1 },
                    }
                    : {
                        hidden: { opacity: 0, y: 75 },
                        visible: { opacity: 1, y: 0 },
                    }
            }
            initial="hidden"
            animate={mainControls}
            className={`${isFull ? "h-full w-full" : ""}  ${
                isCentered ? "flex flex-center" : ""
            } ${styles}`}
            transition={{ delay, duration: animationDuration }}
        >
            {children}
        </motion.div>
    );
};

export default Reveal;