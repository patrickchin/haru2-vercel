export function Form({
  action,
  children,
  confirmPassword,
  extraStyle,
}: {
  action: any;
  children: React.ReactNode;
  confirmPassword?: boolean;
  extraStyle?: string;
}) {
  return (
    <form
      action={action}
      className={`flex flex-col space-y-4 bg-gray-50 px-16 py-8 ${extraStyle}`}
    >
      <div>
        <label
          htmlFor="email"
          className="block text-xs text-gray-600 uppercase"
        >
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="user@acme.com"
          autoComplete="email"
          required
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-xs text-gray-600 uppercase"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black text-sm"
        />
      </div>
      {confirmPassword && (<div>
        <label
          htmlFor="confirm password"
          className="block text-xs text-gray-600 uppercase"
        >
          Confirm Password -- <span className="text-red-500">TODO check locally</span>
        </label>
        <input
          id="confirm-password"
          name="confirm-password"
          type="password"
          required
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black text-sm"
        />
      </div>)}
      {children}
    </form>
  );
}
