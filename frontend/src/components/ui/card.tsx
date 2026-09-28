"use client";

import * as React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Badge } from "./badge";



type BaseImage = {
    thumbnail: string;
    alt?: string;
};

type ProductData = {
    title: string;
    description: string;
    images: BaseImage[];
    techStack?: string[];
    slug?: string;
    domain?: string;
    createdAt?: string;
    label?: string;
};

type SwapCardProps = Omit<HTMLMotionProps<"div">, "ref"> & {
    data: ProductData;
    mode?: string;
    showDots?: boolean;
    showNavButtons?: boolean;
    showThumbnails?: boolean;
};


export const SwapCard = React.forwardRef<HTMLDivElement, SwapCardProps>(
    (
        {
            data,
            className,
            mode = "product",
            showDots = false,
            showNavButtons = true,
            showThumbnails = true,
            ...restProps
        },
        ref
    ) => {
        const [activeIndex, setActiveIndex] = React.useState(0);
        const [isTransitioning, setIsTransitioning] = React.useState(false);
        const total = data.images.length;

        const handleChange = (index: number) => {
            if (isTransitioning || index === activeIndex) return;
            setIsTransitioning(true);
            setActiveIndex(index);
            setTimeout(() => setIsTransitioning(false), 500);
        };

        const next = () => handleChange((activeIndex + 1) % total);
        const prev = () => handleChange((activeIndex - 1 + total) % total);

        const useMotion = mode === "product";

        return (
            <motion.div
                ref={ref}
                className={cn(
                    "w-full rounded-2xl bg-white dark:bg-neutral-900 p-4 shadow-sm max-w-md overflow-hidden space-y-4 transition-all duration-500",
                    "hover:shadow-[0_4px_40px_rgba(59,130,246,0.25)] hover:scale-[1.02]",
                    "hover:bg-gradient-to-br hover:from-indigo-50 hover:via-pink-50 hover:to-purple-50 dark:hover:from-neutral-800 dark:hover:via-neutral-900 dark:hover:to-neutral-800",
                    className
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                {...restProps}
            >
                <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                    {useMotion ? (
                        <AnimatePresence initial={false}>
                            {data.images.map((img, index) => (
                                <motion.div
                                    key={img.thumbnail}
                                    className={cn(
                                        "absolute inset-0 h-full w-full",
                                        activeIndex === index ? "z-10" : "z-0"
                                    )}
                                    initial={false}
                                    animate={{
                                        opacity: activeIndex === index ? 1 : 0,
                                        scale: activeIndex === index ? 1 : 0.92,
                                        y:
                                            activeIndex === index
                                                ? 0
                                                : index < activeIndex
                                                    ? "-100%"
                                                    : "100%",
                                    }}
                                    transition={{
                                        opacity: { duration: 0.5, ease: "easeInOut" },
                                        scale: { duration: 0.5, ease: "easeOut" },
                                        y: { duration: 0.6, ease: [0.33, 1, 0.68, 1] },
                                    }}
                                >
                                    <img
                                        src={img.thumbnail}
                                        alt={img.alt || data.title}
                                        className="h-full w-full object-cover rounded-lg"
                                        loading="lazy"
                                        draggable={false}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    ) : (
                        data.images.map((img, index) => (
                            <div
                                key={img.thumbnail}
                                className={cn(
                                    "absolute inset-0 h-full w-full transition-all duration-500 ease-out",
                                    activeIndex === index
                                        ? "opacity-100 transform-none z-10"
                                        : "opacity-0 scale-95 z-0"
                                )}
                                style={{
                                    transform:
                                        activeIndex === index
                                            ? "none"
                                            : index < activeIndex
                                                ? "translateX(-100%)"
                                                : "translateX(100%)",
                                }}
                            >
                                <img
                                    src={img.thumbnail}
                                    alt={img.alt || data.title}
                                    className="h-full w-full object-cover rounded-lg"
                                />
                            </div>
                        ))
                    )}

                    {/* ---------- Navigation Buttons ---------- */}
                    {showNavButtons && total > 1 && (
                        <>
                            <Button
                                size="icon"
                                variant="secondary"
                                onClick={prev}
                                disabled={isTransitioning}
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 size-8 rounded-full bg-black/40 text-white hover:bg-black/60"
                            >
                                <ChevronLeft size={16} />
                            </Button>
                            <Button
                                size="icon"
                                variant="secondary"
                                onClick={next}
                                disabled={isTransitioning}
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 size-8 rounded-full bg-black/40 text-white hover:bg-black/60"
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </>
                    )}
                </div>

                {showThumbnails && total > 1 && (
                    <div className="flex gap-3 overflow-x-auto pt-3 pb-2 scrollbar-hide">
                        {data.images.map((img, index) => (
                            <button
                                key={img.thumbnail}
                                onClick={() => handleChange(index)}
                                className={cn(
                                    "relative w-16 h-12 flex-shrink-0 rounded-md overflow-hidden border border-neutral-200 dark:border-neutral-700 transition-all duration-300 ml-3",
                                    "hover:scale-105 hover:shadow-md hover:ring-2 hover:ring-indigo-300 dark:hover:ring-indigo-600",
                                    activeIndex === index
                                        ? "ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-neutral-900"
                                        : "opacity-80 hover:opacity-100"
                                )}
                            >
                                <img
                                    src={img.thumbnail}
                                    alt={img.alt || `Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}

                <div className="space-y-2 text-left">
                    <h2 className="font-semibold text-lg text-foreground line-clamp-1">
                        {data.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {data.description}
                    </p>

                    {data.slug && (
                        <Link
                            to={`/detail/${data.slug}`}
                            className="text-sm font-medium text-primary transition-colors after:content-['_↗'] hover:text-primary/80"
                        >
                            {data.label || "View details"}
                        </Link>
                    )}

                    {data.techStack && data.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {data.techStack.map((stack, i) => (
                                <Badge
                                    key={i}
                                    className="bg-muted-foreground/40 text-foreground hover:bg-muted"
                                >
                                    {stack}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {data.domain && (
                    <div className="text-xs text-muted-foreground mt-2">
                        <a
                            href={data.domain}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary transition"
                        >
                            {data.domain}
                        </a>
                    </div>
                )}
            </motion.div>
        );
    }
);

SwapCard.displayName = "SwapCard";
