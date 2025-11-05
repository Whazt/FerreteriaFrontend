function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">🚀 Tailwind está funcionando</h1>
        <p className="text-gray-700 font-light mb-2">
          Este texto usa <span className="font-semibold">font-light</span> y color <span className="text-black">negro</span>.
        </p>
        <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded">
          Botón de prueba
        </button>
      </div>
    </div>
  );
}

export default App;
