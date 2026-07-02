import { Switch, Route, Router as WouterRouter } from "wouter";
import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { SplashScreen } from "@/components/splash-screen";
import { ErrorBoundary } from "@/components/error-boundary";

const Dashboard = lazy(() => import("@/pages/dashboard"));
const MemoryWall = lazy(() => import("@/pages/memory-wall"));
const CafePassport = lazy(() => import("@/pages/cafe-passport"));
const Bookshelf = lazy(() => import("@/pages/bookshelf"));
const NetflixCorner = lazy(() => import("@/pages/netflix-corner"));
const SomedayList = lazy(() => import("@/pages/someday-list"));
const MemoryCapsules = lazy(() => import("@/pages/memory-capsules"));
const KitchenDiaries = lazy(() => import("@/pages/kitchen-diaries"));
const RandomReviews = lazy(() => import("@/pages/random-reviews"));
const NotFound = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (count, error) => count < 2 && !("status" in error && Number(error.status) < 500),
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: 0 },
  },
});

function Router() {
  return (
    <Layout>
      <ErrorBoundary resetKey={window.location.pathname}>
      <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center font-caveat text-xl text-bloom-soft" role="status">opening your journal…</div>}>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/wall" component={MemoryWall} />
        <Route path="/cafes" component={CafePassport} />
        <Route path="/books" component={Bookshelf} />
        <Route path="/movies" component={NetflixCorner} />
        <Route path="/someday" component={SomedayList} />
        <Route path="/capsules" component={MemoryCapsules} />
        <Route path="/kitchen" component={KitchenDiaries} />
        <Route path="/reviews" component={RandomReviews} />
        <Route component={NotFound} />
      </Switch>
      </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SplashScreen />
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
