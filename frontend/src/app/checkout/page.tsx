export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-surface text-brand">
      <section className="mx-auto max-w-3xl px-6 py-14 sm:px-10">
        <div className="rounded-[2rem] bg-white p-10 shadow-soft">
          <h1 className="text-3xl font-black">Checkout</h1>
          <p className="mt-4 text-slate-600">
            Order now with COD and receive confirmation instantly.
          </p>
          <form className="mt-10 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Full Name</span>
                <input
                  type="text"
                  className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3"
                  placeholder="Jane Doe"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Phone Number</span>
                <input
                  type="tel"
                  className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3"
                  placeholder="+1234567890"
                />
              </label>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">City</span>
                <input
                  type="text"
                  className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3"
                  placeholder="Paris"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Address</span>
                <input
                  type="text"
                  className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3"
                  placeholder="123 rue de Lyon"
                />
              </label>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Size</span>
                <select className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3">
                  <option>Choose size</option>
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Color</span>
                <select className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3">
                  <option>Choose color</option>
                  <option>Black</option>
                  <option>White</option>
                </select>
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Quantity</span>
              <input
                type="number"
                min="1"
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3"
                defaultValue={1}
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Order Notes</span>
              <textarea
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3"
                rows={4}
                placeholder="Any delivery notes?"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-full bg-accent px-6 py-4 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              Submit Order
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
