'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

// Search component with debounced input for real-time filtering
// Updates URL parameters as user types with 300ms delay to prevent excessive requests
export default function Search({ placeholder, queryKey }: { placeholder: string; queryKey: string }) {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();
  
  // Debounced search handler - waits 300ms after user stops typing before updating URL
  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    params.set('page','1');
    if(term){
      params.set(queryKey, term);
    }
    else{
      params.delete(queryKey);
    }
    replace(`${pathName}?${params.toString()}`);
    
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0 w-full">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md py-[9px] pl-10 text-sm outline-2 placeholder:text-grey-500 font-bold flex flex-col"
        placeholder={placeholder}
        onChange = {(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue = {searchParams.get(queryKey)?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white-500 peer-focus:text-gray-900" />
    </div>
  );
}
