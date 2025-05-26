
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChange, placeholder = "Search..." }: SearchBarProps) => {
  return (
    <div className="relative max-w-md">
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 bg-white/90 backdrop-blur-md border border-white/20 rounded-xl text-gray-800 placeholder-gray-500 focus:bg-white focus:border-purple-400 transition-all duration-300"
      />
    </div>
  );
};
