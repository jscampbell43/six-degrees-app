import Image from 'next/image';

// Header component - displays app branding and TMDB attribution
// Shows logo on desktop, title, and required TMDB disclaimer
export default function Header() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-8 px-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 w-full mb-8 items-center sm:items-start">
          {/* TMDB logo - visible on all screen sizes */}
          <div className="relative w-[50px] h-[50px]">
            <Image
              src="\blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg"
              fill
              alt="Screenshots of the dashboard showing desktop version"
            />
          </div>
          {/* Required TMDB attribution text */}
          <p className="text-center sm:text-left">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
        {/* App title */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="max-w-xs text-5xl font-semibold leading-10 tracking-tight">
            Six Degrees
          </h1>
        </div>
      </main>
    </div>
  );
}