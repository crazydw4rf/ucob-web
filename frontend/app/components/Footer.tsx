export function Footer() {
  return (
    <footer className="mt-auto bg-gray-900 py-8 text-white">
      <div className="container mx-auto px-4 text-center">
        <p className="mb-2 text-xl font-bold tracking-tight text-white">
          UC<span className="text-secondary-500">OB</span>
        </p>
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} UCOB Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
