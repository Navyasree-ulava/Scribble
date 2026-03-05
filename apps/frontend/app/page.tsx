import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#020617] relative">

      {/* Fixed Dark Sphere Grid Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: "#020617",
          backgroundImage: `
            linear-gradient(to right, rgba(71,85,105,0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(71,85,105,0.3) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%)
          `,
          backgroundSize: "32px 32px, 32px 32px, 100% 100%",
        }}
      />

      {/* Page Content */}
      <div className="relative z-10 text-white">

        {/* Navbar */}
        <nav className="flex items-center justify-between px-10 py-6">
        <h1 className="text-2xl font-bold">Scribble</h1>

  <div className="flex items-center gap-4">

    <Link
      href="/login"
      className="px-5 py-2 rounded-full border border-slate-700 hover:bg-slate-800 transition text-sm"
    >
      Login
    </Link>

    <Link
      href="/signup"
      className="px-5 py-2 rounded-full bg-purple-500 hover:bg-purple-600 transition text-sm font-medium"
    >
      Sign Up
    </Link>

  </div>
</nav>

        {/* Hero Section */}
        <section className="flex flex-col items-center text-center px-6 py-32">

          <h1 className="text-5xl font-bold max-w-4xl leading-tight">
            A collaborative canvas for
            <span className="text-purple-400"> sketches and ideas</span>
          </h1>

          <p className="mt-6 text-slate-400 max-w-2xl text-lg">
            Scribble is a lightweight collaborative whiteboard inspired by
            Excalidraw. Sketch diagrams, brainstorm ideas, and collaborate
            visually with your team in real time.
          </p>

          <div className="flex gap-4 mt-10">
            <button className="px-6 py-3 bg-purple-500 rounded-lg hover:bg-purple-600 font-medium">
              Start Drawing
            </button>
          </div>

        </section>

        {/* Features */}
        <section id="features" className="px-10 pb-24">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">

            <div className="p-6 border border-slate-800 rounded-xl bg-[#020617]/60 backdrop-blur">
              <h3 className="text-xl font-semibold mb-2">Infinite Canvas</h3>
              <p className="text-slate-400">
                Draw freely on an infinite whiteboard with smooth interactions.
              </p>
            </div>

            <div className="p-6 border border-slate-800 rounded-xl bg-[#020617]/60 backdrop-blur">
              <h3 className="text-xl font-semibold mb-2">
                Real-time Collaboration
              </h3>
              <p className="text-slate-400">
                Work together with teammates instantly using WebSockets.
              </p>
            </div>

            <div className="p-6 border border-slate-800 rounded-xl bg-[#020617]/60 backdrop-blur">
              <h3 className="text-xl font-semibold mb-2">Fast & Minimal</h3>
              <p className="text-slate-400">
                Clean interface designed for creativity without distractions.
              </p>
            </div>

          </div>
        </section>

       <footer className="border-t border-slate-800 bg-[#020617]/60 backdrop-blur">
  <div className="max-w-7xl mx-auto px-6 py-16">

    {/* Top Grid */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

      {/* Brand */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Scribble</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          A collaborative whiteboard inspired by Excalidraw. Sketch ideas,
          design diagrams and brainstorm visually with your team.
        </p>

        {/* Social Icons */}
        <div className="flex gap-4 mt-6">

          {/* Github */}
          <a
            href="https://github.com/Navyasree-ulava/Scribble/"
            target="_blank"
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 transition"
          >
            <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.43 7.86 10.96.57.1.78-.25.78-.55 0-.27-.01-.98-.02-1.93-3.2.7-3.87-1.54-3.87-1.54-.52-1.34-1.27-1.7-1.27-1.7-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.74 2.67 1.24 3.32.95.1-.74.4-1.24.72-1.52-2.55-.29-5.23-1.27-5.23-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.17a10.9 10.9 0 012.87-.39c.97 0 1.94.13 2.87.39 2.19-1.48 3.15-1.17 3.15-1.17.62 1.59.23 2.77.11 3.06.73.8 1.18 1.82 1.18 3.07 0 4.4-2.68 5.36-5.24 5.65.41.35.78 1.04.78 2.1 0 1.52-.01 2.75-.01 3.12 0 .3.21.66.79.55A11.51 11.51 0 0023.5 12C23.5 5.65 18.35.5 12 .5z"/>
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/navya-sree-ulava/"
            target="_blank"
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 transition"
          >
            <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6S0 4.88 0 3.5 1.11 1 2.49 1 4.98 2.12 4.98 3.5zM.5 8h4v15h-4V8zm7.5 0h3.83v2.05h.05c.53-1 1.82-2.05 3.75-2.05 4.01 0 4.75 2.64 4.75 6.07V23h-4v-7.72c0-1.84-.03-4.21-2.56-4.21-2.56 0-2.96 2-2.96 4.07V23h-4V8z"/>
            </svg>
          </a>

        </div>
      </div>

      {/* Product */}
      <div>
        <h3 className="text-white font-medium mb-4">Product</h3>
        <ul className="space-y-2 text-slate-400 text-sm">
          <li><a href="#" className="hover:text-white">Features</a></li>
          <li><a href="#" className="hover:text-white">Collaboration</a></li>
          <li><a href="#" className="hover:text-white">Infinite Canvas</a></li>
        </ul>
      </div>

      {/* Resources */}
      <div>
        <h3 className="text-white font-medium mb-4">Resources</h3>
        <ul className="space-y-2 text-slate-400 text-sm">
          <li><a href="#" className="hover:text-white">Documentation</a></li>
          <li><a href="#" className="hover:text-white">GitHub</a></li>
          <li><a href="#" className="hover:text-white">Tutorials</a></li>
        </ul>
      </div>

      {/* Developer */}
      <div>
        <h3 className="text-white font-medium mb-4">Developer</h3>
        <ul className="space-y-2 text-slate-400 text-sm">
          <li>Developed by Navya</li>
          <li>Next.js + WebSockets</li>
          <li>Open Source Project</li>
        </ul>
      </div>

    </div>

    {/* Bottom */}
    <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
      <p>© {new Date().getFullYear()} Scribble. All rights reserved.</p>
      <p>Built with ❤️ by Navya</p>
    </div>

  </div>
</footer>

      </div>
    </div>
  );
}