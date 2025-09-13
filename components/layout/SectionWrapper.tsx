interface SectionWrapperProps {
    children: React.ReactNode;
    className?: string;
}

export default function SectionWrapper({ children, className = "" }: SectionWrapperProps) {
    return (
        <div className={`px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 ${className}`}>
            {children}
        </div>
    );
}