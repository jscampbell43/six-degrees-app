import Image from 'next/image';
export default function Header() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-8 px-4">
        <div className="flex gap-20 w-full mb-8">
          <Image
            src="\blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg"
            width={50}
            height={50}
            className="hidden md:block"
            alt="Screenshots of the dashboard showing desktop version"
          />
          <p>
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="max-w-xs text-5xl font-semibold leading-10 tracking-tight">
            Six Degrees
          </h1>
        </div>
      </main>
    </div>
  );
}