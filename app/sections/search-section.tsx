import Link from "next/link";
import SearchBar from "../components/search-bar/search-bar";

export default function SearchSection() {
  return (
    <section>
      <div className="w-full border-black/20 mt-1 border-t text-center space-y-6 py-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            ask SOHI!
        </h1>
        <SearchBar />
      </div>
    </section>
  );
}

