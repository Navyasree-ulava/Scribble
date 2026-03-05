export default function AuthCard({
  title,
  buttonText,
}: {
  title: string;
  buttonText: string;
}) {
  return (
    <div className="w-full max-w-md bg-[#020617]/70 backdrop-blur border border-slate-800 rounded-2xl p-8 shadow-xl">

      <h2 className="text-2xl font-semibold text-white mb-6 text-center">
        {title}
      </h2>

      <form className="flex flex-col gap-4">

        <input
          type="email"
          placeholder="Email"
          className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
        />

        <input
          type="password"
          placeholder="Password"
          className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
        />

        <button
          className="mt-4 bg-purple-500 hover:bg-purple-600 transition rounded-full py-3 font-medium"
        >
          {buttonText}
        </button>

      </form>
    </div>
  );
}