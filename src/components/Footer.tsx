// src/components/Footer.tsx
export default function Footer() {
    return (
      <footer className="bg-background p-4 border-t">
        <div className="text-sm text-center flex items-center justify-center gap-1">
          <a href="https://one.ie/icon.svg" className="flex items-center gap-1 text-foreground/80 hover:text-foreground transition-colors">
            <img src="https://one.ie/icon.svg" alt="ONE" className="w-[20px] h-[40px]" />
            <span>Powered by ONE</span>
          </a>
        </div>
      </footer>
    );
  }