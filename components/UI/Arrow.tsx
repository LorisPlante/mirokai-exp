const Arrow = ({ direction = "right", color = "white" }: { direction: "right" | "left", color: string }) => {
    return (
        <div className="w-11 h-11 flex items-center justify-center">
            <svg width="30" height="33" viewBox="0 0 30 33" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${color} ${direction === "right" ? "rotate-0" : "rotate-180"}`}>
                <path d="M16.0385 30.75L28.5 16.125L16.0385 1.5M26.7692 16.125H1.5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    );
};

export default Arrow;