export function Footer() {
  return (
    <footer className="px-6 py-8">
      <div className="flex items-center justify-center">
        <a
          href="https://www.base16.studio/"
          target="_blank"
          rel="noopener noreferrer"
          className="group text-[13px] text-ink-3"
        >
          Created by{" "}
          <span className="relative transition-colors duration-200 group-hover:text-ink after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out after:content-[''] group-hover:after:scale-x-100">
            Base16 Labs
          </span>
        </a>
      </div>
    </footer>
  );
}
