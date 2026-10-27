// Rupee amounts in Indian digit grouping, e.g. 80000 -> "₹80,000"
export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`
