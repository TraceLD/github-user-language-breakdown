import { MainContent } from './components/main_content';
import Navbar from './components/navbar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <div className="mt-12 px-8">
          <MainContent />
        </div>
      </QueryClientProvider>
    </>
  );
}

export default App;
